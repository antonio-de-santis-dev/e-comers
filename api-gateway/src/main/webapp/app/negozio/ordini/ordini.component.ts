import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'jhi-ordini',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="container py-5 text-center">
      <h2>I Miei Ordini</h2>
      <p class="text-muted">Pagina in sviluppo...</p>
    </div>
  `,
})
export default class OrdiniComponent {}
