import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { IRigaOrdine } from '../riga-ordine.model';

@Component({
  selector: 'jhi-riga-ordine-detail',
  templateUrl: './riga-ordine-detail.component.html',
  imports: [SharedModule, RouterModule],
})
export class RigaOrdineDetailComponent {
  rigaOrdine = input<IRigaOrdine | null>(null);

  previousState(): void {
    window.history.back();
  }
}
