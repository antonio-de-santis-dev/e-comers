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
import { NotificaService } from '../service/notifica.service';
import { INotifica } from '../notifica.model';
import { NotificaFormGroup, NotificaFormService } from './notifica-form.service';

@Component({
  selector: 'jhi-notifica-update',
  templateUrl: './notifica-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class NotificaUpdateComponent implements OnInit {
  isSaving = false;
  notifica: INotifica | null = null;

  protected dataUtils = inject(DataUtils);
  protected eventManager = inject(EventManager);
  protected notificaService = inject(NotificaService);
  protected notificaFormService = inject(NotificaFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: NotificaFormGroup = this.notificaFormService.createNotificaFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ notifica }) => {
      this.notifica = notifica;
      if (notifica) {
        this.updateForm(notifica);
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
    const notifica = this.notificaFormService.getNotifica(this.editForm);
    if (notifica.id !== null) {
      this.subscribeToSaveResponse(this.notificaService.update(notifica));
    } else {
      this.subscribeToSaveResponse(this.notificaService.create(notifica));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<INotifica>>): void {
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

  protected updateForm(notifica: INotifica): void {
    this.notifica = notifica;
    this.notificaFormService.resetForm(this.editForm, notifica);
  }
}
