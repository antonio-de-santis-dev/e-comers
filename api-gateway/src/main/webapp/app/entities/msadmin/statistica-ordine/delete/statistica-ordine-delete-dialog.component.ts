import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IStatisticaOrdine } from '../statistica-ordine.model';
import { StatisticaOrdineService } from '../service/statistica-ordine.service';

@Component({
  templateUrl: './statistica-ordine-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class StatisticaOrdineDeleteDialogComponent {
  statisticaOrdine?: IStatisticaOrdine;

  protected statisticaOrdineService = inject(StatisticaOrdineService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.statisticaOrdineService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
