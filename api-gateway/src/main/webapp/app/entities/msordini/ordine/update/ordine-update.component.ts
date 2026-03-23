import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TipoSpedizione } from 'app/entities/enumerations/tipo-spedizione.model';
import { StatoOrdine } from 'app/entities/enumerations/stato-ordine.model';
import { IOrdine } from '../ordine.model';
import { OrdineService } from '../service/ordine.service';
import { OrdineFormGroup, OrdineFormService } from './ordine-form.service';

@Component({
  selector: 'jhi-ordine-update',
  templateUrl: './ordine-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class OrdineUpdateComponent implements OnInit {
  isSaving = false;
  ordine: IOrdine | null = null;
  tipoSpedizioneValues = Object.keys(TipoSpedizione);
  statoOrdineValues = Object.keys(StatoOrdine);

  protected ordineService = inject(OrdineService);
  protected ordineFormService = inject(OrdineFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: OrdineFormGroup = this.ordineFormService.createOrdineFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ ordine }) => {
      this.ordine = ordine;
      if (ordine) {
        this.updateForm(ordine);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const ordine = this.ordineFormService.getOrdine(this.editForm);
    if (ordine.id !== null) {
      this.subscribeToSaveResponse(this.ordineService.update(ordine));
    } else {
      this.subscribeToSaveResponse(this.ordineService.create(ordine));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IOrdine>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(ordine: IOrdine): void {
    this.ordine = ordine;
    this.ordineFormService.resetForm(this.editForm, ordine);
  }
}
