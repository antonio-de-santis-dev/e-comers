import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Subject, of } from 'rxjs';
import { takeUntil, catchError } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';

export interface Prodotto {
  id: string;
  nome: string;
  descrizione?: string;
  prezzoUnitario: number;
  immagineCopertina?: string;
  disponibile: boolean;
  votMedio?: number;
  categoria?: {
    id: number;
    nome: string;
  };
}

@Component({
  selector: 'jhi-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  imports: [SharedModule, RouterModule],
})
export default class HomeComponent implements OnInit, OnDestroy {
  // ---- signals (pubblici prima) ----
  account = signal<Account | null>(null);

  prodottiInEvidenza = signal<Prodotto[]>([]);
  topVenduti = signal<Prodotto[]>([]);

  loadingEvidenza = signal(true);
  loadingTop = signal(true);

  carouselIndexEvidenza = signal(0);
  carouselIndexTop = signal(0);

  // ---- dipendenze private ----
  private readonly destroy$ = new Subject<void>();
  private readonly accountService = inject(AccountService);
  private readonly router = inject(Router);
  private readonly http = inject(HttpClient);

  // ---- getter ----
  get visibleCards(): number {
    if (typeof window === 'undefined') return 4;
    if (window.innerWidth < 576) return 1;
    if (window.innerWidth < 768) return 2;
    if (window.innerWidth < 1200) return 3;
    return 4;
  }

  // ---- lifecycle ----
  ngOnInit(): void {
    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(account => this.account.set(account));

    this.loadProdottiInEvidenza();
    this.loadTopVenduti();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ---- azioni pubbliche ----
  login(): void {
    this.router.navigate(['/login']);
  }

  navigateToCatalogo(): void {
    this.router.navigate(['/catalogo']);
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

  // ---- utility ----
  formatPrice(price: number): string {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  }

  getStarsArray(voto: number | undefined): boolean[] {
    const v = Math.round(voto ?? 0);
    return Array.from({ length: 5 }, (_, i) => i < v);
  }

  getImmagine(prodotto: Prodotto): string {
    if (prodotto.immagineCopertina) return prodotto.immagineCopertina;
    return '/content/images/prodotto-placeholder.svg';
  }

  getCurrentYear(): number {
    return new Date().getFullYear();
  }

  // ---- caricamento dati (privati, in fondo) ----
  private loadProdottiInEvidenza(): void {
    this.loadingEvidenza.set(true);
    this.http
      .get<Prodotto[]>('/services/mscatalogo/api/prodottos/in-evidenza')
      .pipe(
        catchError(() => of([])),
        takeUntil(this.destroy$),
      )
      .subscribe(prodotti => {
        this.prodottiInEvidenza.set(prodotti);
        this.loadingEvidenza.set(false);
      });
  }

  private loadTopVenduti(): void {
    this.loadingTop.set(true);
    this.http
      .get<Prodotto[]>('/services/mscatalogo/api/prodottos/top-venduti')
      .pipe(
        catchError(() => of([])),
        takeUntil(this.destroy$),
      )
      .subscribe(prodotti => {
        this.topVenduti.set(prodotti);
        this.loadingTop.set(false);
      });
  }
}
