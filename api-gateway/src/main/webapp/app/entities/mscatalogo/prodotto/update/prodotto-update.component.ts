import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { ICategoria } from 'app/entities/mscatalogo/categoria/categoria.model';
import { CategoriaService } from 'app/entities/mscatalogo/categoria/service/categoria.service';
import { ProdottoService } from '../service/prodotto.service';
import { IProdotto } from '../prodotto.model';
import { ProdottoFormGroup, ProdottoFormService } from './prodotto-form.service';

@Component({
  selector: 'jhi-prodotto-update',
  templateUrl: './prodotto-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ProdottoUpdateComponent implements OnInit {
  isSaving = false;
  prodotto: IProdotto | null = null;

  categoriasSharedCollection: ICategoria[] = [];

  protected dataUtils = inject(DataUtils);
  protected eventManager = inject(EventManager);
  protected prodottoService = inject(ProdottoService);
  protected prodottoFormService = inject(ProdottoFormService);
  protected categoriaService = inject(CategoriaService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: ProdottoFormGroup = this.prodottoFormService.createProdottoFormGroup();

  compareCategoria = (o1: ICategoria | null, o2: ICategoria | null): boolean => this.categoriaService.compareCategoria(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ prodotto }) => {
      this.prodotto = prodotto;
      if (prodotto) {
        this.updateForm(prodotto);
      }

      this.loadRelationshipsOptions();
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
    const prodotto = this.prodottoFormService.getProdotto(this.editForm);
    if (prodotto.id !== null) {
      this.subscribeToSaveResponse(this.prodottoService.update(prodotto));
    } else {
      this.subscribeToSaveResponse(this.prodottoService.create(prodotto));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProdotto>>): void {
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

  protected updateForm(prodotto: IProdotto): void {
    this.prodotto = prodotto;
    this.prodottoFormService.resetForm(this.editForm, prodotto);

    this.categoriasSharedCollection = this.categoriaService.addCategoriaToCollectionIfMissing<ICategoria>(
      this.categoriasSharedCollection,
      prodotto.categoria,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.categoriaService
      .query()
      .pipe(map((res: HttpResponse<ICategoria[]>) => res.body ?? []))
      .pipe(
        map((categorias: ICategoria[]) =>
          this.categoriaService.addCategoriaToCollectionIfMissing<ICategoria>(categorias, this.prodotto?.categoria),
        ),
      )
      .subscribe((categorias: ICategoria[]) => (this.categoriasSharedCollection = categorias));
  }
}
