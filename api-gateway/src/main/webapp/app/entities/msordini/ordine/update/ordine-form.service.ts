import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IOrdine, NewOrdine } from '../ordine.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IOrdine for edit and NewOrdineFormGroupInput for create.
 */
type OrdineFormGroupInput = IOrdine | PartialWithRequiredKeyOf<NewOrdine>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IOrdine | NewOrdine> = Omit<T, 'dataCreazione'> & {
  dataCreazione?: string | null;
};

type OrdineFormRawValue = FormValueOf<IOrdine>;

type NewOrdineFormRawValue = FormValueOf<NewOrdine>;

type OrdineFormDefaults = Pick<NewOrdine, 'id' | 'dataCreazione'>;

type OrdineFormGroupContent = {
  id: FormControl<OrdineFormRawValue['id'] | NewOrdine['id']>;
  numeroOrdine: FormControl<OrdineFormRawValue['numeroOrdine']>;
  clienteId: FormControl<OrdineFormRawValue['clienteId']>;
  nomeCliente: FormControl<OrdineFormRawValue['nomeCliente']>;
  cognomeCliente: FormControl<OrdineFormRawValue['cognomeCliente']>;
  email: FormControl<OrdineFormRawValue['email']>;
  indirizzo: FormControl<OrdineFormRawValue['indirizzo']>;
  citta: FormControl<OrdineFormRawValue['citta']>;
  provincia: FormControl<OrdineFormRawValue['provincia']>;
  cap: FormControl<OrdineFormRawValue['cap']>;
  statoPaese: FormControl<OrdineFormRawValue['statoPaese']>;
  tipoSpedizione: FormControl<OrdineFormRawValue['tipoSpedizione']>;
  costoSpedizione: FormControl<OrdineFormRawValue['costoSpedizione']>;
  totaleImponibile: FormControl<OrdineFormRawValue['totaleImponibile']>;
  totaleIva: FormControl<OrdineFormRawValue['totaleIva']>;
  totaleFinal: FormControl<OrdineFormRawValue['totaleFinal']>;
  statoOrdine: FormControl<OrdineFormRawValue['statoOrdine']>;
  dataCreazione: FormControl<OrdineFormRawValue['dataCreazione']>;
};

export type OrdineFormGroup = FormGroup<OrdineFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class OrdineFormService {
  createOrdineFormGroup(ordine: OrdineFormGroupInput = { id: null }): OrdineFormGroup {
    const ordineRawValue = this.convertOrdineToOrdineRawValue({
      ...this.getFormDefaults(),
      ...ordine,
    });
    return new FormGroup<OrdineFormGroupContent>({
      id: new FormControl(
        { value: ordineRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      numeroOrdine: new FormControl(ordineRawValue.numeroOrdine, {
        validators: [Validators.maxLength(50)],
      }),
      clienteId: new FormControl(ordineRawValue.clienteId, {
        validators: [Validators.required],
      }),
      nomeCliente: new FormControl(ordineRawValue.nomeCliente, {
        validators: [Validators.required, Validators.maxLength(100)],
      }),
      cognomeCliente: new FormControl(ordineRawValue.cognomeCliente, {
        validators: [Validators.required, Validators.maxLength(100)],
      }),
      email: new FormControl(ordineRawValue.email, {
        validators: [Validators.required, Validators.maxLength(200)],
      }),
      indirizzo: new FormControl(ordineRawValue.indirizzo, {
        validators: [Validators.required, Validators.maxLength(300)],
      }),
      citta: new FormControl(ordineRawValue.citta, {
        validators: [Validators.required, Validators.maxLength(100)],
      }),
      provincia: new FormControl(ordineRawValue.provincia, {
        validators: [Validators.maxLength(10)],
      }),
      cap: new FormControl(ordineRawValue.cap, {
        validators: [Validators.maxLength(20)],
      }),
      statoPaese: new FormControl(ordineRawValue.statoPaese, {
        validators: [Validators.maxLength(10)],
      }),
      tipoSpedizione: new FormControl(ordineRawValue.tipoSpedizione, {
        validators: [Validators.required],
      }),
      costoSpedizione: new FormControl(ordineRawValue.costoSpedizione, {
        validators: [Validators.min(0)],
      }),
      totaleImponibile: new FormControl(ordineRawValue.totaleImponibile, {
        validators: [Validators.min(0)],
      }),
      totaleIva: new FormControl(ordineRawValue.totaleIva, {
        validators: [Validators.min(0)],
      }),
      totaleFinal: new FormControl(ordineRawValue.totaleFinal, {
        validators: [Validators.min(0)],
      }),
      statoOrdine: new FormControl(ordineRawValue.statoOrdine, {
        validators: [Validators.required],
      }),
      dataCreazione: new FormControl(ordineRawValue.dataCreazione),
    });
  }

  getOrdine(form: OrdineFormGroup): IOrdine | NewOrdine {
    return this.convertOrdineRawValueToOrdine(form.getRawValue() as OrdineFormRawValue | NewOrdineFormRawValue);
  }

  resetForm(form: OrdineFormGroup, ordine: OrdineFormGroupInput): void {
    const ordineRawValue = this.convertOrdineToOrdineRawValue({ ...this.getFormDefaults(), ...ordine });
    form.reset(
      {
        ...ordineRawValue,
        id: { value: ordineRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): OrdineFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      dataCreazione: currentTime,
    };
  }

  private convertOrdineRawValueToOrdine(rawOrdine: OrdineFormRawValue | NewOrdineFormRawValue): IOrdine | NewOrdine {
    return {
      ...rawOrdine,
      dataCreazione: dayjs(rawOrdine.dataCreazione, DATE_TIME_FORMAT),
    };
  }

  private convertOrdineToOrdineRawValue(
    ordine: IOrdine | (Partial<NewOrdine> & OrdineFormDefaults),
  ): OrdineFormRawValue | PartialWithRequiredKeyOf<NewOrdineFormRawValue> {
    return {
      ...ordine,
      dataCreazione: ordine.dataCreazione ? ordine.dataCreazione.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
