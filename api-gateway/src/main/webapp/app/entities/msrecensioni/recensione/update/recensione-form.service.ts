import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IRecensione, NewRecensione } from '../recensione.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IRecensione for edit and NewRecensioneFormGroupInput for create.
 */
type RecensioneFormGroupInput = IRecensione | PartialWithRequiredKeyOf<NewRecensione>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IRecensione | NewRecensione> = Omit<T, 'dataRecensione'> & {
  dataRecensione?: string | null;
};

type RecensioneFormRawValue = FormValueOf<IRecensione>;

type NewRecensioneFormRawValue = FormValueOf<NewRecensione>;

type RecensioneFormDefaults = Pick<NewRecensione, 'id' | 'approvata' | 'dataRecensione'>;

type RecensioneFormGroupContent = {
  id: FormControl<RecensioneFormRawValue['id'] | NewRecensione['id']>;
  prodottoId: FormControl<RecensioneFormRawValue['prodottoId']>;
  ordineId: FormControl<RecensioneFormRawValue['ordineId']>;
  nomeCliente: FormControl<RecensioneFormRawValue['nomeCliente']>;
  descrizione: FormControl<RecensioneFormRawValue['descrizione']>;
  votoSingolo: FormControl<RecensioneFormRawValue['votoSingolo']>;
  approvata: FormControl<RecensioneFormRawValue['approvata']>;
  dataRecensione: FormControl<RecensioneFormRawValue['dataRecensione']>;
};

export type RecensioneFormGroup = FormGroup<RecensioneFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class RecensioneFormService {
  createRecensioneFormGroup(recensione: RecensioneFormGroupInput = { id: null }): RecensioneFormGroup {
    const recensioneRawValue = this.convertRecensioneToRecensioneRawValue({
      ...this.getFormDefaults(),
      ...recensione,
    });
    return new FormGroup<RecensioneFormGroupContent>({
      id: new FormControl(
        { value: recensioneRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      prodottoId: new FormControl(recensioneRawValue.prodottoId, {
        validators: [Validators.required],
      }),
      ordineId: new FormControl(recensioneRawValue.ordineId),
      nomeCliente: new FormControl(recensioneRawValue.nomeCliente, {
        validators: [Validators.required, Validators.maxLength(200)],
      }),
      descrizione: new FormControl(recensioneRawValue.descrizione, {
        validators: [Validators.required],
      }),
      votoSingolo: new FormControl(recensioneRawValue.votoSingolo, {
        validators: [Validators.required, Validators.min(1), Validators.max(5)],
      }),
      approvata: new FormControl(recensioneRawValue.approvata),
      dataRecensione: new FormControl(recensioneRawValue.dataRecensione),
    });
  }

  getRecensione(form: RecensioneFormGroup): IRecensione | NewRecensione {
    return this.convertRecensioneRawValueToRecensione(form.getRawValue() as RecensioneFormRawValue | NewRecensioneFormRawValue);
  }

  resetForm(form: RecensioneFormGroup, recensione: RecensioneFormGroupInput): void {
    const recensioneRawValue = this.convertRecensioneToRecensioneRawValue({ ...this.getFormDefaults(), ...recensione });
    form.reset(
      {
        ...recensioneRawValue,
        id: { value: recensioneRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): RecensioneFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      approvata: false,
      dataRecensione: currentTime,
    };
  }

  private convertRecensioneRawValueToRecensione(
    rawRecensione: RecensioneFormRawValue | NewRecensioneFormRawValue,
  ): IRecensione | NewRecensione {
    return {
      ...rawRecensione,
      dataRecensione: dayjs(rawRecensione.dataRecensione, DATE_TIME_FORMAT),
    };
  }

  private convertRecensioneToRecensioneRawValue(
    recensione: IRecensione | (Partial<NewRecensione> & RecensioneFormDefaults),
  ): RecensioneFormRawValue | PartialWithRequiredKeyOf<NewRecensioneFormRawValue> {
    return {
      ...recensione,
      dataRecensione: recensione.dataRecensione ? recensione.dataRecensione.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
