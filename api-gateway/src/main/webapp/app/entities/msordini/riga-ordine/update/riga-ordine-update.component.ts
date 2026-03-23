import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IOrdine } from 'app/entities/msordini/ordine/ordine.model';
import { OrdineService } from 'app/entities/msordini/ordine/service/ordine.service';
import { IRigaOrdine } from '../riga-ordine.model';
import { RigaOrdineService } from '../service/riga-ordine.service';
import { RigaOrdineFormGroup, RigaOrdineFormService } from './riga-ordine-form.service';

@Component({
  selector: 'jhi-riga-ordine-update',
  templateUrl: './riga-ordine-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class RigaOrdineUpdateComponent implements OnInit {
  isSaving = false;
  rigaOrdine: IRigaOrdine | null = null;

  ordinesSharedCollection: IOrdine[] = [];

  protected rigaOrdineService = inject(RigaOrdineService);
  protected rigaOrdineFormService = inject(RigaOrdineFormService);
  protected ordineService = inject(OrdineService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: RigaOrdineFormGroup = this.rigaOrdineFormService.createRigaOrdineFormGroup();

  compareOrdine = (o1: IOrdine | null, o2: IOrdine | null): boolean => this.ordineService.compareOrdine(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ rigaOrdine }) => {
      this.rigaOrdine = rigaOrdine;
      if (rigaOrdine) {
        this.updateForm(rigaOrdine);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const rigaOrdine = this.rigaOrdineFormService.getRigaOrdine(this.editForm);
    if (rigaOrdine.id !== null) {
      this.subscribeToSaveResponse(this.rigaOrdineService.update(rigaOrdine));
    } else {
      this.subscribeToSaveResponse(this.rigaOrdineService.create(rigaOrdine));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IRigaOrdine>>): void {
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

  protected updateForm(rigaOrdine: IRigaOrdine): void {
    this.rigaOrdine = rigaOrdine;
    this.rigaOrdineFormService.resetForm(this.editForm, rigaOrdine);

    this.ordinesSharedCollection = this.ordineService.addOrdineToCollectionIfMissing<IOrdine>(
      this.ordinesSharedCollection,
      rigaOrdine.ordine,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.ordineService
      .query()
      .pipe(map((res: HttpResponse<IOrdine[]>) => res.body ?? []))
      .pipe(map((ordines: IOrdine[]) => this.ordineService.addOrdineToCollectionIfMissing<IOrdine>(ordines, this.rigaOrdine?.ordine)))
      .subscribe((ordines: IOrdine[]) => (this.ordinesSharedCollection = ordines));
  }
}
