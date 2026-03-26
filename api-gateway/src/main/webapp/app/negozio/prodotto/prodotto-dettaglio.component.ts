import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, of } from 'rxjs';
import { takeUntil, catchError } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { CarrelloService } from 'app/negozio/carrello/carrello.service';

// -------------------------------------------------------
// NOTA: l'id è UUID (stringa), NON un numero intero.
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
  // Immagini blob (base64 dal backend)
  immagineCopertina?: string | null;
  immagineCopertinaContentType?: string | null;
  immagineProdotto?: string | null;
  immagineProdottoContentType?: string | null;
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
  imports: [RouterModule, DecimalPipe, FormsModule, SharedModule],
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
  immagineAttiva = signal<string>('');  // immagine correntemente visualizzata

  // ---- Form recensione ----
  formRecensione = signal(false);
  invioRecensione = signal(false);
  invioOk = signal(false);
  invioErrore = signal<string | null>(null);

  nuovaRecensione = {
    nomeCliente: '',
    descrizione: '',
    votoSingolo: 5,
  };

  // Immagine placeholder
  readonly PLACEHOLDER = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiB2aWV3Qm94PSIwIDAgNDAwIDQwMCI+CiAgPHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9IiNmNWY1ZjUiLz4KICA8cmVjdCB4PSIxMjAiIHk9IjEwMCIgd2lkdGg9IjE2MCIgaGVpZ2h0PSIxMjAiIHJ4PSIxMiIgZmlsbD0iI2UwZTBlMCIvPgogIDxjaXJjbGUgY3g9IjIwMCIgY3k9IjI4MCIgcj0iNDAiIGZpbGw9IiNlMGUwZTAiLz4KICA8dGV4dCB4PSIyMDAiIHk9IjM3MCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiNiYmIiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkltbWFnaW5lIHByb2RvdHRvPC90ZXh0Pgo8L3N2Zz4=';

  // ---- Dipendenze ----
  private readonly destroy$ = new Subject<void>();
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly http = inject(HttpClient);
  private readonly accountService = inject(AccountService);
  private readonly carrelloService = inject(CarrelloService);

  // ---- Lifecycle ----
  ngOnInit(): void {
    // Chiudi zoom con tasto Escape
    document.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Escape' && this.imgZoom()) {
        this.chiudiZoom();
      }
    });

    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(acc => this.account.set(acc));

    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
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
          this.immagineAttiva.set(this.getAllImmagini(p)[0]);
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

  // ---- Azioni carrello ----
  aggiungiAlCarrello(): void {
    const p = this.prodotto();
    if (!p) return;
    const qta = this.quantita();
    for (let i = 0; i < qta; i++) {
      this.carrelloService.aggiungi({
        id: p.id,
        nome: p.nome,
        prezzo: p.prezzo,
        immagineUrl: p.immagineUrl,
      });
    }
    // Feedback visivo temporaneo navigando al carrello
    this.router.navigate(['/carrello']);
  }

  acquistaOra(): void {
    const p = this.prodotto();
    if (!p) return;
    const qta = this.quantita();
    for (let i = 0; i < qta; i++) {
      this.carrelloService.aggiungi({
        id: p.id,
        nome: p.nome,
        prezzo: p.prezzo,
        immagineUrl: p.immagineUrl,
      });
    }
    this.router.navigate(['/carrello']);
  }

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

  toggleZoom(): void {
    this.imgZoom.update(v => !v);
  }

  apriZoom(): void {
    this.imgZoom.set(true);
    document.body.style.overflow = 'hidden';
  }

  chiudiZoom(): void {
    this.imgZoom.set(false);
    document.body.style.overflow = '';
  }

  selezionaImmagine(img: string): void {
    this.immagineAttiva.set(img);
  }

  immaginePrec(p: Prodotto): void {
    const imgs = this.getAllImmagini(p);
    const idx = imgs.indexOf(this.immagineAttiva());
    this.immagineAttiva.set(imgs[(idx - 1 + imgs.length) % imgs.length]);
  }

  immagineSuc(p: Prodotto): void {
    const imgs = this.getAllImmagini(p);
    const idx = imgs.indexOf(this.immagineAttiva());
    this.immagineAttiva.set(imgs[(idx + 1) % imgs.length]);
  }

  // Costruisce la lista immagini dal prodotto:
  // 1a immagine = immagineCopertina (la card/cover)
  // 2a+ immagine = immagineProdotto (dettaglio prodotto)
  // Fallback = placeholder SVG
  getAllImmagini(p: Prodotto | null): string[] {
    if (!p) return [this.PLACEHOLDER];
    const imgs: string[] = [];

    if (p.immagineCopertina && p.immagineCopertinaContentType) {
      imgs.push(`data:${p.immagineCopertinaContentType};base64,${p.immagineCopertina}`);
    }
    if (p.immagineProdotto && p.immagineProdottoContentType) {
      imgs.push(`data:${p.immagineProdottoContentType};base64,${p.immagineProdotto}`);
    }
    if (imgs.length === 0) {
      imgs.push(this.PLACEHOLDER);
    }
    return imgs;
  }

  // ---- Form recensione ----
  apriFormRecensione(): void {
    this.formRecensione.set(true);
    this.invioOk.set(false);
    this.invioErrore.set(null);
    this.nuovaRecensione = { nomeCliente: '', descrizione: '', votoSingolo: 5 };
  }

  chiudiFormRecensione(): void {
    this.formRecensione.set(false);
  }

  setVoto(voto: number): void {
    this.nuovaRecensione.votoSingolo = voto;
  }

  inviaRecensione(): void {
    const p = this.prodotto();
    if (!p) return;

    const { nomeCliente, descrizione, votoSingolo } = this.nuovaRecensione;
    if (!nomeCliente.trim() || !descrizione.trim()) {
      this.invioErrore.set('Nome e testo della recensione sono obbligatori.');
      return;
    }

    this.invioRecensione.set(true);
    this.invioErrore.set(null);

    // ordineId obbligatorio nel DTO — usiamo un UUID placeholder
    // In futuro va passato l'ordineId reale dell'utente
    const PLACEHOLDER_ORDINE_ID = '00000000-0000-0000-0000-000000000000';

    this.http
      .post('/services/msrecensioni/api/recensiones', {
        prodottoId: p.id,
        ordineId: PLACEHOLDER_ORDINE_ID,
        nomeCliente: nomeCliente.trim(),
        descrizione: descrizione.trim(),
        votoSingolo,
      })
      .pipe(
        catchError(err => {
          const msg = err?.error?.detail ?? 'Errore durante l\'invio. Riprova più tardi.';
          this.invioErrore.set(msg);
          this.invioRecensione.set(false);
          return of(null);
        }),
        takeUntil(this.destroy$),
      )
      .subscribe(result => {
        if (result !== null) {
          this.invioRecensione.set(false);
          this.invioOk.set(true);
          this.formRecensione.set(false);
          // Non ricarica: la recensione deve essere approvata prima di apparire
        }
      });
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

  getStarsInteractive(): number[] {
    return [1, 2, 3, 4, 5];
  }

  getImmagine(prodotto: Prodotto | null): string {
    return this.immagineAttiva() || this.PLACEHOLDER;
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
