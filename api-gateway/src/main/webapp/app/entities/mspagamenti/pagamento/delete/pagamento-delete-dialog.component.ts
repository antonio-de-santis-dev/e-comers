import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IPagamento } from '../pagamento.model';
import { PagamentoService } from '../service/pagamento.service';

@Component({
  templateUrl: './pagamento-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class PagamentoDeleteDialogComponent {
  pagamento?: IPagamento;

  protected pagamentoService = inject(PagamentoService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.pagamentoService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
