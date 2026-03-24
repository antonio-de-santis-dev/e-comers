import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DecimalPipe } from '@angular/common';
import { Subject, of, forkJoin } from 'rxjs';
import { takeUntil, catchError } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';

// -------------------------------------------------------
// Interfacce locali — rispecchiano il modello JHipster
// -------------------------------------------------------
interface Prodotto {
  id: number;
  nome?: string | null;
  descrizione?: string | null;
  prezzo?: number | null;
  quantitaDisponibile?: number | null;
  inEvidenza?: boolean | null;
  immagineUrl?: string | null;
  votaMedio?: number | null;
  categoria?: { id: number; nome: string } | null;
}

interface Recensione {
  id: number;
  prodottoId?: string | null;
  nomeCliente?: string | null;
  descrizione?: string | null;
  votoSingolo?: number | null;
  approvata?: boolean | null;
  dataRecensione?: string | null;
}

@Component({
  selector: 'jhi-prodotto-dettaglio',
  standalone: true,
  imports: [RouterModule, DecimalPipe, SharedModule],
  templateUrl: './prodotto-dettaglio.component.html',
  styleUrl: './prodotto-dettaglio.component.scss',
})
export default class ProdottoDettaglioComponent implements OnInit, OnDestroy {
  // ---- Signals ----
  prodotto = signal<Prodotto | null>(null);
  recensioni = signal<Recensione[]>([]);
  account = signal<Account | null>(null);

  loadingProdotto = signal(true);
  loadingRecensioni = signal(true);
  errore = signal(false);

  // Quantità selezionata per il carrello
  quantita = signal(1);

  // Immagine ingrandita (lightbox minimale)
  imgZoom = signal(false);

  // ---- Dipendenze ----
  private readonly destroy$ = new Subject<void>();
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly http = inject(HttpClient);
  private readonly accountService = inject(AccountService);

  // ---- Lifecycle ----
  ngOnInit(): void {
    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(acc => this.account.set(acc));

    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        const id = params.get('id');
        if (id) {
          this.loadProdotto(+id);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ---- Caricamento dati ----
  private loadProdotto(id: number): void {
    this.loadingProdotto.set(true);
    this.errore.set(false);

    this.http
      .get<Prodotto>(`/services/mscatalogo/api/prodottos/${id}`)
      .pipe(
        catchError(() => {
          this.errore.set(true);
          return of(null);
        }),
        takeUntil(this.destroy$),
      )
      .subscribe(p => {
        this.prodotto.set(p);
        this.loadingProdotto.set(false);
        if (p) {
          this.loadRecensioni(id);
        }
      });
  }

  private loadRecensioni(prodottoId: number): void {
    this.loadingRecensioni.set(true);

    this.http
      .get<Recensione[]>(`/services/msrecensioni/api/recensiones`, {
        params: {
          'prodottoId.equals': prodottoId.toString(),
          'approvata.equals': 'true',
          size: '20',
          sort: 'dataRecensione,desc',
        },
      })
      .pipe(
        catchError(() => of([])),
        takeUntil(this.destroy$),
      )
      .subscribe(rec => {
        this.recensioni.set(rec);
        this.loadingRecensioni.set(false);
      });
  }

  // ---- Azioni ----
  tornaAlCatalogo(): void {
    this.router.navigate(['/catalogo']);
  }

  incrementaQuantita(): void {
    const p = this.prodotto();
    const max = p?.quantitaDisponibile ?? 99;
    this.quantita.update(q => Math.min(q + 1, max));
  }

  decrementaQuantita(): void {
    this.quantita.update(q => Math.max(1, q - 1));
  }

  aggiungiAlCarrello(): void {
    // TODO: collegare al servizio carrello quando implementato
    console.log('Aggiungi al carrello:', this.prodotto()?.id, 'x', this.quantita());
  }

  toggleZoom(): void {
    this.imgZoom.update(v => !v);
  }

  // ---- Utility ----
  formatPrice(price: number | null | undefined): string {
    if (price == null) return '—';
    return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(price);
  }

  getStarsArray(voto: number | null | undefined): boolean[] {
    const v = Math.round(voto ?? 0);
    return Array.from({ length: 5 }, (_, i) => i < v);
  }

  getImmagine(prodotto: Prodotto | null): string {
    if (prodotto?.immagineUrl) return prodotto.immagineUrl;
    return '/content/images/prodotto-placeholder.svg';
  }

  isDisponibile(prodotto: Prodotto | null): boolean {
    return prodotto?.quantitaDisponibile == null || prodotto.quantitaDisponibile > 0;
  }

  formatData(data: string | null | undefined): string {
    if (!data) return '';
    return new Date(data).toLocaleDateString('it-IT', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  }

  recensioniApprovate(): Recensione[] {
    return this.recensioni().filter(r => r.approvata !== false);
  }
}
