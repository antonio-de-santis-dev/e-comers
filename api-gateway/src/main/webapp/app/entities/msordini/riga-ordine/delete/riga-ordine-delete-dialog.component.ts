import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IRigaOrdine } from '../riga-ordine.model';
import { RigaOrdineService } from '../service/riga-ordine.service';

@Component({
  templateUrl: './riga-ordine-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class RigaOrdineDeleteDialogComponent {
  rigaOrdine?: IRigaOrdine;

  protected rigaOrdineService = inject(RigaOrdineService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.rigaOrdineService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
