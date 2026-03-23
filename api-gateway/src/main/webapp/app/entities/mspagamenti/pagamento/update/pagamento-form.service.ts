import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IPagamento, NewPagamento } from '../pagamento.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IPagamento for edit and NewPagamentoFormGroupInput for create.
 */
type PagamentoFormGroupInput = IPagamento | PartialWithRequiredKeyOf<NewPagamento>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IPagamento | NewPagamento> = Omit<T, 'dataOperazione'> & {
  dataOperazione?: string | null;
};

type PagamentoFormRawValue = FormValueOf<IPagamento>;

type NewPagamentoFormRawValue = FormValueOf<NewPagamento>;

type PagamentoFormDefaults = Pick<NewPagamento, 'id' | 'dataOperazione'>;

type PagamentoFormGroupContent = {
  id: FormControl<PagamentoFormRawValue['id'] | NewPagamento['id']>;
  ordineId: FormControl<PagamentoFormRawValue['ordineId']>;
  importo: FormControl<PagamentoFormRawValue['importo']>;
  metodoPagamento: FormControl<PagamentoFormRawValue['metodoPagamento']>;
  statoPagamento: FormControl<PagamentoFormRawValue['statoPagamento']>;
  dataOperazione: FormControl<PagamentoFormRawValue['dataOperazione']>;
  transazioneId: FormControl<PagamentoFormRawValue['transazioneId']>;
  note: FormControl<PagamentoFormRawValue['note']>;
};

export type PagamentoFormGroup = FormGroup<PagamentoFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class PagamentoFormService {
  createPagamentoFormGroup(pagamento: PagamentoFormGroupInput = { id: null }): PagamentoFormGroup {
    const pagamentoRawValue = this.convertPagamentoToPagamentoRawValue({
      ...this.getFormDefaults(),
      ...pagamento,
    });
    return new FormGroup<PagamentoFormGroupContent>({
      id: new FormControl(
        { value: pagamentoRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      ordineId: new FormControl(pagamentoRawValue.ordineId, {
        validators: [Validators.required],
      }),
      importo: new FormControl(pagamentoRawValue.importo, {
        validators: [Validators.required, Validators.min(0)],
      }),
      metodoPagamento: new FormControl(pagamentoRawValue.metodoPagamento, {
        validators: [Validators.required],
      }),
      statoPagamento: new FormControl(pagamentoRawValue.statoPagamento, {
        validators: [Validators.required],
      }),
      dataOperazione: new FormControl(pagamentoRawValue.dataOperazione),
      transazioneId: new FormControl(pagamentoRawValue.transazioneId, {
        validators: [Validators.maxLength(200)],
      }),
      note: new FormControl(pagamentoRawValue.note, {
        validators: [Validators.maxLength(500)],
      }),
    });
  }

  getPagamento(form: PagamentoFormGroup): IPagamento | NewPagamento {
    return this.convertPagamentoRawValueToPagamento(form.getRawValue() as PagamentoFormRawValue | NewPagamentoFormRawValue);
  }

  resetForm(form: PagamentoFormGroup, pagamento: PagamentoFormGroupInput): void {
    const pagamentoRawValue = this.convertPagamentoToPagamentoRawValue({ ...this.getFormDefaults(), ...pagamento });
    form.reset(
      {
        ...pagamentoRawValue,
        id: { value: pagamentoRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): PagamentoFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      dataOperazione: currentTime,
    };
  }

  private convertPagamentoRawValueToPagamento(rawPagamento: PagamentoFormRawValue | NewPagamentoFormRawValue): IPagamento | NewPagamento {
    return {
      ...rawPagamento,
      dataOperazione: dayjs(rawPagamento.dataOperazione, DATE_TIME_FORMAT),
    };
  }

  private convertPagamentoToPagamentoRawValue(
    pagamento: IPagamento | (Partial<NewPagamento> & PagamentoFormDefaults),
  ): PagamentoFormRawValue | PartialWithRequiredKeyOf<NewPagamentoFormRawValue> {
    return {
      ...pagamento,
      dataOperazione: pagamento.dataOperazione ? pagamento.dataOperazione.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
