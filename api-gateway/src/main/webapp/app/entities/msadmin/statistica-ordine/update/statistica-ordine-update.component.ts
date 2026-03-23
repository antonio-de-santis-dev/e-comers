import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IStatisticaOrdine } from '../statistica-ordine.model';
import { StatisticaOrdineService } from '../service/statistica-ordine.service';
import { StatisticaOrdineFormGroup, StatisticaOrdineFormService } from './statistica-ordine-form.service';

@Component({
  selector: 'jhi-statistica-ordine-update',
  templateUrl: './statistica-ordine-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class StatisticaOrdineUpdateComponent implements OnInit {
  isSaving = false;
  statisticaOrdine: IStatisticaOrdine | null = null;

  protected statisticaOrdineService = inject(StatisticaOrdineService);
  protected statisticaOrdineFormService = inject(StatisticaOrdineFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: StatisticaOrdineFormGroup = this.statisticaOrdineFormService.createStatisticaOrdineFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ statisticaOrdine }) => {
      this.statisticaOrdine = statisticaOrdine;
      if (statisticaOrdine) {
        this.updateForm(statisticaOrdine);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const statisticaOrdine = this.statisticaOrdineFormService.getStatisticaOrdine(this.editForm);
    if (statisticaOrdine.id !== null) {
      this.subscribeToSaveResponse(this.statisticaOrdineService.update(statisticaOrdine));
    } else {
      this.subscribeToSaveResponse(this.statisticaOrdineService.create(statisticaOrdine));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IStatisticaOrdine>>): void {
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

  protected updateForm(statisticaOrdine: IStatisticaOrdine): void {
    this.statisticaOrdine = statisticaOrdine;
    this.statisticaOrdineFormService.resetForm(this.editForm, statisticaOrdine);
  }
}
