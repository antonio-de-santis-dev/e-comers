import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IStatisticaOrdine, NewStatisticaOrdine } from '../statistica-ordine.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IStatisticaOrdine for edit and NewStatisticaOrdineFormGroupInput for create.
 */
type StatisticaOrdineFormGroupInput = IStatisticaOrdine | PartialWithRequiredKeyOf<NewStatisticaOrdine>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IStatisticaOrdine | NewStatisticaOrdine> = Omit<T, 'dataRegistrazione'> & {
  dataRegistrazione?: string | null;
};

type StatisticaOrdineFormRawValue = FormValueOf<IStatisticaOrdine>;

type NewStatisticaOrdineFormRawValue = FormValueOf<NewStatisticaOrdine>;

type StatisticaOrdineFormDefaults = Pick<NewStatisticaOrdine, 'id' | 'dataRegistrazione'>;

type StatisticaOrdineFormGroupContent = {
  id: FormControl<StatisticaOrdineFormRawValue['id'] | NewStatisticaOrdine['id']>;
  ordineId: FormControl<StatisticaOrdineFormRawValue['ordineId']>;
  importoTotale: FormControl<StatisticaOrdineFormRawValue['importoTotale']>;
  statoOrdine: FormControl<StatisticaOrdineFormRawValue['statoOrdine']>;
  microservizio: FormControl<StatisticaOrdineFormRawValue['microservizio']>;
  dataRegistrazione: FormControl<StatisticaOrdineFormRawValue['dataRegistrazione']>;
  note: FormControl<StatisticaOrdineFormRawValue['note']>;
};

export type StatisticaOrdineFormGroup = FormGroup<StatisticaOrdineFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class StatisticaOrdineFormService {
  createStatisticaOrdineFormGroup(statisticaOrdine: StatisticaOrdineFormGroupInput = { id: null }): StatisticaOrdineFormGroup {
    const statisticaOrdineRawValue = this.convertStatisticaOrdineToStatisticaOrdineRawValue({
      ...this.getFormDefaults(),
      ...statisticaOrdine,
    });
    return new FormGroup<StatisticaOrdineFormGroupContent>({
      id: new FormControl(
        { value: statisticaOrdineRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      ordineId: new FormControl(statisticaOrdineRawValue.ordineId, {
        validators: [Validators.required],
      }),
      importoTotale: new FormControl(statisticaOrdineRawValue.importoTotale, {
        validators: [Validators.min(0)],
      }),
      statoOrdine: new FormControl(statisticaOrdineRawValue.statoOrdine, {
        validators: [Validators.maxLength(50)],
      }),
      microservizio: new FormControl(statisticaOrdineRawValue.microservizio, {
        validators: [Validators.maxLength(100)],
      }),
      dataRegistrazione: new FormControl(statisticaOrdineRawValue.dataRegistrazione),
      note: new FormControl(statisticaOrdineRawValue.note, {
        validators: [Validators.maxLength(500)],
      }),
    });
  }

  getStatisticaOrdine(form: StatisticaOrdineFormGroup): IStatisticaOrdine | NewStatisticaOrdine {
    return this.convertStatisticaOrdineRawValueToStatisticaOrdine(
      form.getRawValue() as StatisticaOrdineFormRawValue | NewStatisticaOrdineFormRawValue,
    );
  }

  resetForm(form: StatisticaOrdineFormGroup, statisticaOrdine: StatisticaOrdineFormGroupInput): void {
    const statisticaOrdineRawValue = this.convertStatisticaOrdineToStatisticaOrdineRawValue({
      ...this.getFormDefaults(),
      ...statisticaOrdine,
    });
    form.reset(
      {
        ...statisticaOrdineRawValue,
        id: { value: statisticaOrdineRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): StatisticaOrdineFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      dataRegistrazione: currentTime,
    };
  }

  private convertStatisticaOrdineRawValueToStatisticaOrdine(
    rawStatisticaOrdine: StatisticaOrdineFormRawValue | NewStatisticaOrdineFormRawValue,
  ): IStatisticaOrdine | NewStatisticaOrdine {
    return {
      ...rawStatisticaOrdine,
      dataRegistrazione: dayjs(rawStatisticaOrdine.dataRegistrazione, DATE_TIME_FORMAT),
    };
  }

  private convertStatisticaOrdineToStatisticaOrdineRawValue(
    statisticaOrdine: IStatisticaOrdine | (Partial<NewStatisticaOrdine> & StatisticaOrdineFormDefaults),
  ): StatisticaOrdineFormRawValue | PartialWithRequiredKeyOf<NewStatisticaOrdineFormRawValue> {
    return {
      ...statisticaOrdine,
      dataRegistrazione: statisticaOrdine.dataRegistrazione ? statisticaOrdine.dataRegistrazione.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
