import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { FormatMediumDatetimePipe } from 'app/shared/date';
import { IOrdine } from '../ordine.model';

@Component({
  selector: 'jhi-ordine-detail',
  templateUrl: './ordine-detail.component.html',
  imports: [SharedModule, RouterModule, FormatMediumDatetimePipe],
})
export class OrdineDetailComponent {
  ordine = input<IOrdine | null>(null);

  previousState(): void {
    window.history.back();
  }
}
