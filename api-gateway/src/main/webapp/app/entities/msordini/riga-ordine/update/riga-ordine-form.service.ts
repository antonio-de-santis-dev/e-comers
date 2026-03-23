import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IRigaOrdine, NewRigaOrdine } from '../riga-ordine.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IRigaOrdine for edit and NewRigaOrdineFormGroupInput for create.
 */
type RigaOrdineFormGroupInput = IRigaOrdine | PartialWithRequiredKeyOf<NewRigaOrdine>;

type RigaOrdineFormDefaults = Pick<NewRigaOrdine, 'id'>;

type RigaOrdineFormGroupContent = {
  id: FormControl<IRigaOrdine['id'] | NewRigaOrdine['id']>;
  prodottoId: FormControl<IRigaOrdine['prodottoId']>;
  nomeProdotto: FormControl<IRigaOrdine['nomeProdotto']>;
  quantita: FormControl<IRigaOrdine['quantita']>;
  prezzoUnitario: FormControl<IRigaOrdine['prezzoUnitario']>;
  totaleRiga: FormControl<IRigaOrdine['totaleRiga']>;
  ordine: FormControl<IRigaOrdine['ordine']>;
};

export type RigaOrdineFormGroup = FormGroup<RigaOrdineFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class RigaOrdineFormService {
  createRigaOrdineFormGroup(rigaOrdine: RigaOrdineFormGroupInput = { id: null }): RigaOrdineFormGroup {
    const rigaOrdineRawValue = {
      ...this.getFormDefaults(),
      ...rigaOrdine,
    };
    return new FormGroup<RigaOrdineFormGroupContent>({
      id: new FormControl(
        { value: rigaOrdineRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      prodottoId: new FormControl(rigaOrdineRawValue.prodottoId, {
        validators: [Validators.required],
      }),
      nomeProdotto: new FormControl(rigaOrdineRawValue.nomeProdotto, {
        validators: [Validators.required, Validators.maxLength(200)],
      }),
      quantita: new FormControl(rigaOrdineRawValue.quantita, {
        validators: [Validators.required, Validators.min(1)],
      }),
      prezzoUnitario: new FormControl(rigaOrdineRawValue.prezzoUnitario, {
        validators: [Validators.required, Validators.min(0)],
      }),
      totaleRiga: new FormControl(rigaOrdineRawValue.totaleRiga, {
        validators: [Validators.min(0)],
      }),
      ordine: new FormControl(rigaOrdineRawValue.ordine),
    });
  }

  getRigaOrdine(form: RigaOrdineFormGroup): IRigaOrdine | NewRigaOrdine {
    return form.getRawValue() as IRigaOrdine | NewRigaOrdine;
  }

  resetForm(form: RigaOrdineFormGroup, rigaOrdine: RigaOrdineFormGroupInput): void {
    const rigaOrdineRawValue = { ...this.getFormDefaults(), ...rigaOrdine };
    form.reset(
      {
        ...rigaOrdineRawValue,
        id: { value: rigaOrdineRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): RigaOrdineFormDefaults {
    return {
      id: null,
    };
  }
}
