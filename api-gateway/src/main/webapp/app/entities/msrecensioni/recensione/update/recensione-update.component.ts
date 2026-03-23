import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { RecensioneService } from '../service/recensione.service';
import { IRecensione } from '../recensione.model';
import { RecensioneFormGroup, RecensioneFormService } from './recensione-form.service';

@Component({
  selector: 'jhi-recensione-update',
  templateUrl: './recensione-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class RecensioneUpdateComponent implements OnInit {
  isSaving = false;
  recensione: IRecensione | null = null;

  protected dataUtils = inject(DataUtils);
  protected eventManager = inject(EventManager);
  protected recensioneService = inject(RecensioneService);
  protected recensioneFormService = inject(RecensioneFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: RecensioneFormGroup = this.recensioneFormService.createRecensioneFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ recensione }) => {
      this.recensione = recensione;
      if (recensione) {
        this.updateForm(recensione);
      }
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('apiGatewayApp.error', { ...err, key: `error.file.${err.key}` })),
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const recensione = this.recensioneFormService.getRecensione(this.editForm);
    if (recensione.id !== null) {
      this.subscribeToSaveResponse(this.recensioneService.update(recensione));
    } else {
      this.subscribeToSaveResponse(this.recensioneService.create(recensione));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IRecensione>>): void {
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

  protected updateForm(recensione: IRecensione): void {
    this.recensione = recensione;
    this.recensioneFormService.resetForm(this.editForm, recensione);
  }
}
