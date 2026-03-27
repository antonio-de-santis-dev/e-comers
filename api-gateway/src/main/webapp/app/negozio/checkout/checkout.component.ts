import { Component, OnInit, OnDestroy, inject, signal, computed } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Subject, of } from 'rxjs';
import { takeUntil, catchError, switchMap } from 'rxjs/operators';
import SharedModule from 'app/shared/shared.module';
import { CarrelloService, CarrelloItem } from 'app/negozio/carrello/carrello.service';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';

type Step = 'spedizione' | 'pagamento' | 'riepilogo' | 'successo';

interface SpedizioneForm {
  nome: string;
  cognome: string;
  email: string;
  telefono: string;
  indirizzo: string;
  citta: string;
  provincia: string;
  cap: string;
  noteSpedizione: string;
}

interface PagamentoForm {
  metodo: 'CARTA_CREDITO' | 'CARTA_DEBITO' | 'PAYPAL';
  // Carta
  numeroCarta: string;
  intestatario: string;
  scadenza: string;
  cvv: string;
  // PayPal
  emailPaypal: string;
}

interface TipoSpedizioneOption {
  valore: 'STANDARD' | 'EXPRESS' | 'SAME_DAY' | 'RITIRO';
  etichetta: string;
  descrizione: string;
  costo: number;
  giorni: string;
}

@Component({
  selector: 'jhi-checkout',
  standalone: true,
  imports: [SharedModule, FormsModule, RouterModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
})
export default class CheckoutComponent implements OnInit, OnDestroy {

  // ── Step ──────────────────────────────────────────────
  step = signal<Step>('spedizione');

  stepIndex = computed(() => {
    const map: Record<Step, number> = { spedizione: 0, pagamento: 1, riepilogo: 2, successo: 3 };
    return map[this.step()];
  });

  // ── Carrello ──────────────────────────────────────────
  items = signal<CarrelloItem[]>([]);
  subtotale = computed(() => this.items().reduce((s, i) => s + i.prezzo * i.quantita, 0));
  totaleArticoli = computed(() => this.items().reduce((s, i) => s + i.quantita, 0));

  // ── Spedizione ────────────────────────────────────────
  readonly opzioniSpedizione: TipoSpedizioneOption[] = [
    { valore: 'STANDARD', etichetta: 'Standard',         descrizione: 'Consegna in 3-5 giorni lavorativi', costo: 0,    giorni: '3-5 gg' },
    { valore: 'EXPRESS',  etichetta: 'Express',          descrizione: 'Consegna in 1-2 giorni lavorativi', costo: 5.99, giorni: '1-2 gg' },
    { valore: 'SAME_DAY', etichetta: 'Same Day',         descrizione: 'Consegna entro oggi (ordini entro le 12:00)', costo: 9.99, giorni: 'oggi' },
    { valore: 'RITIRO',   etichetta: 'Ritiro in negozio', descrizione: 'Ritira direttamente in negozio',    costo: 0,    giorni: '' },
  ];

  tipoSpedizioneSelezionato = signal<TipoSpedizioneOption>(this.opzioniSpedizione[0]);
  costoSpedizione = computed(() => this.tipoSpedizioneSelezionato().costo);

  readonly ALIQUOTA_IVA = 0.22;
  imponibile = computed(() => (this.subtotale() + this.costoSpedizione()) / (1 + this.ALIQUOTA_IVA));
  iva        = computed(() => this.subtotale() + this.costoSpedizione() - this.imponibile());
  totale     = computed(() => this.subtotale() + this.costoSpedizione());

  // ── Form spedizione ───────────────────────────────────
  form: SpedizioneForm = {
    nome: '', cognome: '', email: '', telefono: '',
    indirizzo: '', citta: '', provincia: '', cap: '', noteSpedizione: '',
  };
  erroriForm: Partial<Record<keyof SpedizioneForm, string>> = {};

  // ── Form pagamento ────────────────────────────────────
  pagamento: PagamentoForm = {
    metodo: 'CARTA_CREDITO',
    numeroCarta: '', intestatario: '', scadenza: '', cvv: '',
    emailPaypal: '',
  };
  erroriPagamento: Partial<Record<keyof PagamentoForm, string>> = {};

  // ── Invio ─────────────────────────────────────────────
  invioInCorso    = signal(false);
  erroreInvio     = signal<string | null>(null);
  numeroOrdineCreato = signal<string | null>(null);

  // ── Deps ─────────────────────────────────────────────
  private readonly destroy$ = new Subject<void>();
  private readonly router = inject(Router);
  private readonly http = inject(HttpClient);
  private readonly carrelloService = inject(CarrelloService);
  private readonly accountService = inject(AccountService);
  private account: Account | null = null;

  // ── Lifecycle ─────────────────────────────────────────
  ngOnInit(): void {
    const items = this.carrelloService.getItems();
    if (items.length === 0) { this.router.navigate(['/carrello']); return; }
    this.items.set(items);

    this.accountService.getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(acc => {
        this.account = acc;
        if (acc) {
          this.form.email   = acc.email ?? '';
          this.form.nome    = acc.firstName ?? '';
          this.form.cognome = acc.lastName ?? '';
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ── Navigazione ───────────────────────────────────────
  avanti(): void {
    if (this.step() === 'spedizione') {
      if (!this.validaSpedizione()) return;
      this.step.set('pagamento');
    } else if (this.step() === 'pagamento') {
      if (!this.validaPagamento()) return;
      this.step.set('riepilogo');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  indietro(): void {
    if (this.step() === 'pagamento') this.step.set('spedizione');
    else if (this.step() === 'riepilogo') this.step.set('pagamento');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  selezionaSpedizione(o: TipoSpedizioneOption): void { this.tipoSpedizioneSelezionato.set(o); }
  selezionaMetodo(m: PagamentoForm['metodo']): void  { this.pagamento.metodo = m; this.erroriPagamento = {}; }

  // ── Validazione spedizione ────────────────────────────
  private validaSpedizione(): boolean {
    this.erroriForm = {};
    const f = this.form;
    if (!f.nome.trim())      this.erroriForm.nome      = 'Campo obbligatorio';
    if (!f.cognome.trim())   this.erroriForm.cognome   = 'Campo obbligatorio';
    if (!f.email.trim())     this.erroriForm.email     = 'Campo obbligatorio';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) this.erroriForm.email = 'Email non valida';
    if (!f.indirizzo.trim()) this.erroriForm.indirizzo = 'Campo obbligatorio';
    if (!f.citta.trim())     this.erroriForm.citta     = 'Campo obbligatorio';
    if (!f.provincia.trim()) this.erroriForm.provincia = 'Campo obbligatorio';
    else if (f.provincia.length > 2) this.erroriForm.provincia = 'Max 2 caratteri (es. LE)';
    if (!f.cap.trim())       this.erroriForm.cap       = 'Campo obbligatorio';
    else if (!/^\d{5}$/.test(f.cap)) this.erroriForm.cap = '5 cifre (es. 73100)';
    return Object.keys(this.erroriForm).length === 0;
  }

  // ── Validazione pagamento ─────────────────────────────
  private validaPagamento(): boolean {
    this.erroriPagamento = {};
    const p = this.pagamento;
    if (p.metodo === 'PAYPAL') {
      if (!p.emailPaypal.trim()) this.erroriPagamento.emailPaypal = 'Inserisci l\'email PayPal';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.emailPaypal))
        this.erroriPagamento.emailPaypal = 'Email non valida';
    } else {
      // Carta credito/debito
      const num = p.numeroCarta.replace(/\s/g, '');
      if (!num) this.erroriPagamento.numeroCarta = 'Campo obbligatorio';
      else if (!/^\d{16}$/.test(num)) this.erroriPagamento.numeroCarta = '16 cifre richieste';

      if (!p.intestatario.trim()) this.erroriPagamento.intestatario = 'Campo obbligatorio';

      if (!p.scadenza.trim()) this.erroriPagamento.scadenza = 'Campo obbligatorio';
      else if (!/^\d{2}\/\d{2}$/.test(p.scadenza)) this.erroriPagamento.scadenza = 'Formato MM/AA';

      if (!p.cvv.trim()) this.erroriPagamento.cvv = 'Campo obbligatorio';
      else if (!/^\d{3,4}$/.test(p.cvv)) this.erroriPagamento.cvv = '3-4 cifre';
    }
    return Object.keys(this.erroriPagamento).length === 0;
  }

  // ── Formatta numero carta con spazi ogni 4 cifre ──────
  formattaCarta(event: Event): void {
    const input = event.target as HTMLInputElement;
    let val = input.value.replace(/\D/g, '').substring(0, 16);
    val = val.replace(/(.{4})/g, '$1 ').trim();
    this.pagamento.numeroCarta = val;
    input.value = val;
  }

  // ── Conferma e invio ordine ───────────────────────────
  confermaOrdine(): void {
    this.invioInCorso.set(true);
    this.erroreInvio.set(null);

    const spedizione = this.tipoSpedizioneSelezionato();
    const f = this.form;

    const payload = {
      clienteId: '00000000-0000-0000-0000-000000000000',
      nomeCliente:    f.nome.trim(),
      cognomeCliente: f.cognome.trim(),
      email:          f.email.trim(),
      telefono:       f.telefono.trim() || null,
      indirizzo:      f.indirizzo.trim(),
      citta:          f.citta.trim(),
      provincia:      f.provincia.trim().toUpperCase(),
      cap:            f.cap.trim(),
      noteSpedizione: f.noteSpedizione.trim() || null,
      tipoSpedizione: spedizione.valore,
      costoSpedizione: +spedizione.costo.toFixed(2),
      totaleImponibile: +this.imponibile().toFixed(2),
      totaleIva:        +this.iva().toFixed(2),
      totaleFinal:      +this.totale().toFixed(2),
      righe: this.items().map(item => ({
        prodottoId:     item.id,
        nomeProdotto:   item.nome,
        prezzoUnitario: item.prezzo,
        quantita:       item.quantita,
        aliquotaIva:    this.ALIQUOTA_IVA,
      })),
      metodoPagamento: this.pagamento.metodo,
    };

    this.http.post<{ ordineId: string; numeroOrdine: string }>(
      '/services/msordini/api/checkout', payload
    ).pipe(
      catchError(err => {
        const msg = err?.error?.detail ?? err?.error?.title ?? 'Errore durante la creazione dell\'ordine. Riprova.';
        this.erroreInvio.set(msg);
        this.invioInCorso.set(false);
        return of(null);
      }),
      switchMap(ordine => {
        if (!ordine) return of(null);
        this.numeroOrdineCreato.set(ordine.numeroOrdine);

        // Registra pagamento su ms-pagamenti (APPROVATO simulato)
        return this.http.post('/services/mspagamenti/api/pagamentos', {
          ordineId:        ordine.ordineId,
          metodoPagamento: this.pagamento.metodo,
          importo:         +this.totale().toFixed(2),
          stato:           'APPROVATO',
          transazioneId:   'TXN-' + Math.random().toString(36).substring(2, 12).toUpperCase(),
        }).pipe(catchError(() => of(null)));
      }),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      if (this.numeroOrdineCreato()) {
        this.carrelloService.svuota();
        this.invioInCorso.set(false);
        this.step.set('successo');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  // ── Utility ───────────────────────────────────────────
  formatPrice(p: number): string {
    return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(p);
  }

  getImmagine(item: CarrelloItem): string { return item.immagineUrl || ''; }

  tornaAlCatalogo(): void { this.router.navigate(['/catalogo']); }
  vaiAiMieiOrdini(): void { this.router.navigate(['/ordini']); }

  // ── Card live preview ──────────────────────────────────
  get cardBrand(): 'visa' | 'mastercard' | 'other' {
    const num = this.pagamento.numeroCarta.replace(/\s/g, '');
    if (/^4/.test(num)) return 'visa';
    if (/^5[1-5]/.test(num) || /^2[2-7]/.test(num)) return 'mastercard';
    return 'other';
  }

  get cardNumberDisplay(): string {
    const n = this.pagamento.numeroCarta || '';
    if (!n) return '•••• •••• •••• ••••';
    // Pad con bullets fino a 19 char (16 cifre + 3 spazi)
    const padded = n.padEnd(19, '•');
    return padded;
  }

  get cardHolder(): string {
    return this.pagamento.intestatario?.trim().toUpperCase() || 'NOME INTESTATARIO';
  }

  get cardExpiry(): string {
    return this.pagamento.scadenza || 'MM/AA';
  }

  cvvFocused = false;

  onCvvFocus(): void  { this.cvvFocused = true; }
  onCvvBlur(): void   { this.cvvFocused = false; }

  get ultime4Carta(): string {
    const num = this.pagamento.numeroCarta.replace(/\s/g, '');
    return num.length >= 4 ? num.slice(-4) : num;
  }

  get metodoPagamentoLabel(): string {
    const labels: Record<string, string> = {
      CARTA_CREDITO: 'Carta di credito',
      CARTA_DEBITO:  'Carta di debito',
      PAYPAL:        'PayPal',
    };
    return labels[this.pagamento.metodo] ?? this.pagamento.metodo;
  }
}
