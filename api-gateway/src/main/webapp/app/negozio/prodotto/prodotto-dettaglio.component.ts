import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DecimalPipe } from '@angular/common';
import { Subject, of } from 'rxjs';
import { takeUntil, catchError } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';

// -------------------------------------------------------
// NOTA: l'id è UUID (stringa), NON un numero intero.
// Il vecchio codice faceva +id (conversione a Number)
// che produceva NaN → GET /prodottos/NaN → 400.
// Ora si usa l'id come stringa pura.
// -------------------------------------------------------

interface Prodotto {
  id: string;                          // UUID — stringa
  nome?: string | null;
  descrizione?: string | null;
  prezzo?: number | null;
  quantitaDisponibile?: number | null;
  inEvidenza?: boolean | null;
  immagineUrl?: string | null;
  votaMedio?: number | null;
  votoTotale?: number | null;
  categoria?: { id: string | number; nome: string } | null;
}

interface Recensione {
  id: string;
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

  quantita = signal(1);
  imgZoom = signal(false);

  // Immagine placeholder fino a quando non arriva dal backend
  readonly PLACEHOLDER = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiB2aWV3Qm94PSIwIDAgNDAwIDQwMCI+CiAgPHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9IiNmNWY1ZjUiLz4KICA8cmVjdCB4PSIxMjAiIHk9IjEwMCIgd2lkdGg9IjE2MCIgaGVpZ2h0PSIxMjAiIHJ4PSIxMiIgZmlsbD0iI2UwZTBlMCIvPgogIDxjaXJjbGUgY3g9IjIwMCIgY3k9IjI4MCIgcj0iNDAiIGZpbGw9IiNlMGUwZTAiLz4KICA8dGV4dCB4PSIyMDAiIHk9IjM3MCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiNiYmIiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkltbWFnaW5lIHByb2RvdHRvPC90ZXh0Pgo8L3N2Zz4=';

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
        // ✅ FIX: id è UUID stringa — NON convertire con +id
        const id = params.get('id');
        if (id) {
          this.loadProdotto(id);
        } else {
          this.errore.set(true);
          this.loadingProdotto.set(false);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ---- Caricamento dati ----
  private loadProdotto(id: string): void {
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

  private loadRecensioni(prodottoId: string): void {
    this.loadingRecensioni.set(true);

    this.http
      .get<Recensione[]>(`/services/msrecensioni/api/recensiones`, {
        params: {
          'prodottoId.equals': prodottoId,
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
    this.router.navigate(['/catalogo/prodotti']);
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
    const p = this.prodotto();
    if (!p) return;
    // TODO: collegare al CarrelloService
    console.log('Aggiungi al carrello:', p.id, 'x', this.quantita());
  }

  acquistaOra(): void {
    const p = this.prodotto();
    if (!p) return;
    // TODO: navigare al checkout con questo prodotto
    console.log('Acquista ora:', p.id, 'x', this.quantita());
    this.router.navigate(['/checkout'], {
      queryParams: { prodottoId: p.id, quantita: this.quantita() }
    });
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
    // Per ora usa sempre il placeholder — sostituire con la vera immagine dal backend
    return this.PLACEHOLDER;
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
