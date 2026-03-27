import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Subject, of } from 'rxjs';
import { takeUntil, catchError } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { CarrelloService } from 'app/negozio/carrello/carrello.service';

export interface Prodotto {
  id: string;
  nome: string;
  descrizione?: string;
  prezzo?: number | null;
  /** @deprecated usa prezzo — mantenuto per compatibilità endpoint top-venduti */
  prezzoUnitario?: number;
  immagineCopertina?: string | null;
  immagineCopertinaContentType?: string | null;
  disponibile?: boolean | null;
  quantitaDisponibile?: number | null;
  votoTotale?: number | null;
  inEvidenza?: boolean | null;
  categoria?: { id: number; nome: string };
}

@Component({
  selector: 'jhi-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  imports: [SharedModule, RouterModule],
})
export default class HomeComponent implements OnInit, OnDestroy {

  // ---- signals ----
  account = signal<Account | null>(null);
  prodottiInEvidenza = signal<Prodotto[]>([]);
  topVenduti = signal<Prodotto[]>([]);
  loadingEvidenza = signal(true);
  loadingTop = signal(true);
  carouselIndexEvidenza = signal(0);
  carouselIndexTop = signal(0);

  // ---- dipendenze ----
  private readonly destroy$ = new Subject<void>();
  private readonly accountService = inject(AccountService);
  private readonly router = inject(Router);
  private readonly http = inject(HttpClient);
  private readonly carrelloService = inject(CarrelloService);

  readonly PLACEHOLDER = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiB2aWV3Qm94PSIwIDAgNDAwIDQwMCI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9IiNmNWY1ZjUiLz48cmVjdCB4PSIxMjAiIHk9IjEwMCIgd2lkdGg9IjE2MCIgaGVpZ2h0PSIxMjAiIHJ4PSIxMiIgZmlsbD0iI2UwZTBlMCIvPjxjaXJjbGUgY3g9IjIwMCIgY3k9IjI4MCIgcj0iNDAiIGZpbGw9IiNlMGUwZTAiLz48dGV4dCB4PSIyMDAiIHk9IjM3MCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiNiYmIiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkltbWFnaW5lIHByb2RvdHRvPC90ZXh0Pjwvc3ZnPg==';

  // ---- getter ----
  get visibleCards(): number {
    if (typeof window === 'undefined') return 4;
    if (window.innerWidth < 576)  return 1;
    if (window.innerWidth < 768)  return 2;
    if (window.innerWidth < 1200) return 3;
    return 4;
  }

  // ---- lifecycle ----
  ngOnInit(): void {
    this.accountService.getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(account => this.account.set(account));
    this.loadProdottiInEvidenza();
    this.loadTopVenduti();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ---- carosello ----
  prevSlide(carousel: 'evidenza' | 'top'): void {
    if (carousel === 'evidenza') {
      this.carouselIndexEvidenza.update(i => Math.max(0, i - 1));
    } else {
      this.carouselIndexTop.update(i => Math.max(0, i - 1));
    }
  }

  nextSlide(carousel: 'evidenza' | 'top'): void {
    if (carousel === 'evidenza') {
      const max = Math.max(0, this.prodottiInEvidenza().length - this.visibleCards);
      this.carouselIndexEvidenza.update(i => Math.min(max, i + 1));
    } else {
      const max = Math.max(0, this.topVenduti().length - this.visibleCards);
      this.carouselIndexTop.update(i => Math.min(max, i + 1));
    }
  }

  canPrev(carousel: 'evidenza' | 'top'): boolean {
    return carousel === 'evidenza' ? this.carouselIndexEvidenza() > 0 : this.carouselIndexTop() > 0;
  }

  canNext(carousel: 'evidenza' | 'top'): boolean {
    if (carousel === 'evidenza') {
      return this.carouselIndexEvidenza() < this.prodottiInEvidenza().length - this.visibleCards;
    }
    return this.carouselIndexTop() < this.topVenduti().length - this.visibleCards;
  }

  translateX(carousel: 'evidenza' | 'top'): string {
    const idx = carousel === 'evidenza' ? this.carouselIndexEvidenza() : this.carouselIndexTop();
    const cardWidth = 100 / this.visibleCards;
    return `translateX(-${idx * cardWidth}%)`;
  }

  // ---- azioni carrello ----
  aggiungiAlCarrello(event: Event, prodotto: Prodotto): void {
    event.preventDefault();
    event.stopPropagation();
    const prezzo = prodotto.prezzo ?? prodotto.prezzoUnitario ?? 0;
    this.carrelloService.aggiungi({
      id: prodotto.id,
      nome: prodotto.nome,
      prezzo,
      immagineUrl: this.getImmagine(prodotto),
    });
  }

  acquistaOra(event: Event, prodotto: Prodotto): void {
    event.preventDefault();
    event.stopPropagation();
    const prezzo = prodotto.prezzo ?? prodotto.prezzoUnitario ?? 0;
    this.carrelloService.aggiungi({
      id: prodotto.id,
      nome: prodotto.nome,
      prezzo,
      immagineUrl: this.getImmagine(prodotto),
    });
    this.router.navigate(['/carrello']);
  }

  // ---- utility ----
  formatPrice(price: number | null | undefined): string {
    if (price == null) return '—';
    return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(price);
  }

  getPrezzo(p: Prodotto): number | null | undefined {
    return p.prezzo ?? p.prezzoUnitario;
  }

  getStelle(voto: number | null | undefined): string[] {
    const v = Math.round(voto ?? 0);
    return Array.from({ length: 5 }, (_, i) => i < v ? '★' : '☆');
  }

  getImmagine(prodotto: Prodotto): string {
    if (prodotto.immagineCopertina && prodotto.immagineCopertina.length > 10) {
      const ct = prodotto.immagineCopertinaContentType ?? 'image/jpeg';
      return `data:${ct};base64,${prodotto.immagineCopertina}`;
    }
    return this.PLACEHOLDER;
  }

  getCurrentYear(): number {
    return new Date().getFullYear();
  }

  // ---- caricamento dati ----
  private loadProdottiInEvidenza(): void {
    this.loadingEvidenza.set(true);
    this.http.get<Prodotto[]>('/services/mscatalogo/api/prodottos/in-evidenza')
      .pipe(catchError(() => of([])), takeUntil(this.destroy$))
      .subscribe(prodotti => {
        this.prodottiInEvidenza.set(prodotti);
        this.loadingEvidenza.set(false);
      });
  }

  private loadTopVenduti(): void {
    this.loadingTop.set(true);
    this.http.get<Prodotto[]>('/services/mscatalogo/api/prodottos/top-venduti')
      .pipe(catchError(() => of([])), takeUntil(this.destroy$))
      .subscribe(prodotti => {
        this.topVenduti.set(prodotti);
        this.loadingTop.set(false);
      });
  }
}
