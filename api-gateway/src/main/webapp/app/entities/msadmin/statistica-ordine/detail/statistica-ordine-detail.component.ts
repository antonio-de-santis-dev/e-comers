import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { FormatMediumDatetimePipe } from 'app/shared/date';
import { IStatisticaOrdine } from '../statistica-ordine.model';

@Component({
  selector: 'jhi-statistica-ordine-detail',
  templateUrl: './statistica-ordine-detail.component.html',
  imports: [SharedModule, RouterModule, FormatMediumDatetimePipe],
})
export class StatisticaOrdineDetailComponent {
  statisticaOrdine = input<IStatisticaOrdine | null>(null);

  previousState(): void {
    window.history.back();
  }
}
