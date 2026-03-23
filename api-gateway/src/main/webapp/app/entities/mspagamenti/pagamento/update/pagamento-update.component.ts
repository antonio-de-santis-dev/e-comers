import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MetodoPagamento } from 'app/entities/enumerations/metodo-pagamento.model';
import { StatoPagamento } from 'app/entities/enumerations/stato-pagamento.model';
import { IPagamento } from '../pagamento.model';
import { PagamentoService } from '../service/pagamento.service';
import { PagamentoFormGroup, PagamentoFormService } from './pagamento-form.service';

@Component({
  selector: 'jhi-pagamento-update',
  templateUrl: './pagamento-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class PagamentoUpdateComponent implements OnInit {
  isSaving = false;
  pagamento: IPagamento | null = null;
  metodoPagamentoValues = Object.keys(MetodoPagamento);
  statoPagamentoValues = Object.keys(StatoPagamento);

  protected pagamentoService = inject(PagamentoService);
  protected pagamentoFormService = inject(PagamentoFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: PagamentoFormGroup = this.pagamentoFormService.createPagamentoFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ pagamento }) => {
      this.pagamento = pagamento;
      if (pagamento) {
        this.updateForm(pagamento);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const pagamento = this.pagamentoFormService.getPagamento(this.editForm);
    if (pagamento.id !== null) {
      this.subscribeToSaveResponse(this.pagamentoService.update(pagamento));
    } else {
      this.subscribeToSaveResponse(this.pagamentoService.create(pagamento));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPagamento>>): void {
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

  protected updateForm(pagamento: IPagamento): void {
    this.pagamento = pagamento;
    this.pagamentoFormService.resetForm(this.editForm, pagamento);
  }
}
