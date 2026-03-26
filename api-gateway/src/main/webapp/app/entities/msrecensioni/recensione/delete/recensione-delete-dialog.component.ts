import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IRecensione } from '../recensione.model';
import { RecensioneService } from '../service/recensione.service';

@Component({
  templateUrl: './recensione-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class RecensioneDeleteDialogComponent {
  recensione?: IRecensione;

  protected recensioneService = inject(RecensioneService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.recensioneService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
