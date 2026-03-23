import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IOrdine } from '../ordine.model';
import { OrdineService } from '../service/ordine.service';

@Component({
  templateUrl: './ordine-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class OrdineDeleteDialogComponent {
  ordine?: IOrdine;

  protected ordineService = inject(OrdineService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.ordineService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
