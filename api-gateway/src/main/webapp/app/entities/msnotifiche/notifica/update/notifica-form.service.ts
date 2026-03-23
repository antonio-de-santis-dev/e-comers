import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { INotifica, NewNotifica } from '../notifica.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts INotifica for edit and NewNotificaFormGroupInput for create.
 */
type NotificaFormGroupInput = INotifica | PartialWithRequiredKeyOf<NewNotifica>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends INotifica | NewNotifica> = Omit<T, 'dataNotifica'> & {
  dataNotifica?: string | null;
};

type NotificaFormRawValue = FormValueOf<INotifica>;

type NewNotificaFormRawValue = FormValueOf<NewNotifica>;

type NotificaFormDefaults = Pick<NewNotifica, 'id' | 'letta' | 'dataNotifica'>;

type NotificaFormGroupContent = {
  id: FormControl<NotificaFormRawValue['id'] | NewNotifica['id']>;
  tipo: FormControl<NotificaFormRawValue['tipo']>;
  messaggio: FormControl<NotificaFormRawValue['messaggio']>;
  destinatario: FormControl<NotificaFormRawValue['destinatario']>;
  letta: FormControl<NotificaFormRawValue['letta']>;
  dataNotifica: FormControl<NotificaFormRawValue['dataNotifica']>;
  riferimentoId: FormControl<NotificaFormRawValue['riferimentoId']>;
};

export type NotificaFormGroup = FormGroup<NotificaFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class NotificaFormService {
  createNotificaFormGroup(notifica: NotificaFormGroupInput = { id: null }): NotificaFormGroup {
    const notificaRawValue = this.convertNotificaToNotificaRawValue({
      ...this.getFormDefaults(),
      ...notifica,
    });
    return new FormGroup<NotificaFormGroupContent>({
      id: new FormControl(
        { value: notificaRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      tipo: new FormControl(notificaRawValue.tipo, {
        validators: [Validators.required, Validators.maxLength(100)],
      }),
      messaggio: new FormControl(notificaRawValue.messaggio, {
        validators: [Validators.required],
      }),
      destinatario: new FormControl(notificaRawValue.destinatario, {
        validators: [Validators.required, Validators.maxLength(200)],
      }),
      letta: new FormControl(notificaRawValue.letta),
      dataNotifica: new FormControl(notificaRawValue.dataNotifica),
      riferimentoId: new FormControl(notificaRawValue.riferimentoId, {
        validators: [Validators.maxLength(100)],
      }),
    });
  }

  getNotifica(form: NotificaFormGroup): INotifica | NewNotifica {
    return this.convertNotificaRawValueToNotifica(form.getRawValue() as NotificaFormRawValue | NewNotificaFormRawValue);
  }

  resetForm(form: NotificaFormGroup, notifica: NotificaFormGroupInput): void {
    const notificaRawValue = this.convertNotificaToNotificaRawValue({ ...this.getFormDefaults(), ...notifica });
    form.reset(
      {
        ...notificaRawValue,
        id: { value: notificaRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): NotificaFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      letta: false,
      dataNotifica: currentTime,
    };
  }

  private convertNotificaRawValueToNotifica(rawNotifica: NotificaFormRawValue | NewNotificaFormRawValue): INotifica | NewNotifica {
    return {
      ...rawNotifica,
      dataNotifica: dayjs(rawNotifica.dataNotifica, DATE_TIME_FORMAT),
    };
  }

  private convertNotificaToNotificaRawValue(
    notifica: INotifica | (Partial<NewNotifica> & NotificaFormDefaults),
  ): NotificaFormRawValue | PartialWithRequiredKeyOf<NewNotificaFormRawValue> {
    return {
      ...notifica,
      dataNotifica: notifica.dataNotifica ? notifica.dataNotifica.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
