import { Component, OnInit, OnDestroy, inject, signal, computed } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { Subject } from 'rxjs';
import SharedModule from 'app/shared/shared.module';
import { CarrelloService, CarrelloItem } from './carrello.service';

@Component({
  selector: 'jhi-carrello',
  standalone: true,
  imports: [RouterModule, DecimalPipe, SharedModule],
  templateUrl: './carrello.component.html',
  styleUrl: './carrello.component.scss',
})
export default class CarrelloComponent implements OnInit, OnDestroy {

  // ---- State ----
  items = signal<CarrelloItem[]>([]);

  totale = computed(() =>
    this.items().reduce((sum, i) => sum + i.prezzo * i.quantita, 0)
  );

  totaleArticoli = computed(() =>
    this.items().reduce((sum, i) => sum + i.quantita, 0)
  );

  // ---- Deps ----
  private readonly destroy$ = new Subject<void>();
  private readonly router = inject(Router);
  readonly carrelloService = inject(CarrelloService);

  // ---- Lifecycle ----
  ngOnInit(): void {
    this.items.set(this.carrelloService.getItems());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ---- Azioni ----
  rimuovi(id: number): void {
    this.carrelloService.rimuovi(id);
    this.items.set(this.carrelloService.getItems());
  }

  modificaQuantita(id: number, nuovaQta: number): void {
    if (nuovaQta <= 0) {
      this.rimuovi(id);
    } else {
      this.carrelloService.modificaQuantita(id, nuovaQta);
      this.items.set(this.carrelloService.getItems());
    }
  }

  svuotaCarrello(): void {
    this.carrelloService.svuota();
    this.items.set([]);
  }

  continuaAcquisti(): void {
    this.router.navigate(['/catalogo']);
  }

  procediPagamento(): void {
    // TODO: collegare al microservizio ordini
    this.router.navigate(['/ordini/nuovo']);
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(price);
  }

  getImmagine(item: CarrelloItem): string {
    return item.immagineUrl || '/content/images/prodotto-placeholder.svg';
  }
}
