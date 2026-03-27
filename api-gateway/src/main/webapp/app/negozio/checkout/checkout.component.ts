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

type Step = 'spedizione' | 'riepilogo' | 'successo';

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

  // ── Step corrente ─────────────────────────────────────
  step = signal<Step>('spedizione');

  // ── Dati carrello ──────────────────────────────────────
  items = signal<CarrelloItem[]>([]);

  subtotale = computed(() =>
    this.items().reduce((s, i) => s + i.prezzo * i.quantita, 0)
  );
  totaleArticoli = computed(() =>
    this.items().reduce((s, i) => s + i.quantita, 0)
  );

  // ── Spedizione ────────────────────────────────────────
  readonly opzioniSpedizione: TipoSpedizioneOption[] = [
    { valore: 'STANDARD', etichetta: 'Standard',  descrizione: 'Consegna in 3-5 giorni lavorativi', costo: 0,    giorni: '3-5 gg' },
    { valore: 'EXPRESS',  etichetta: 'Express',   descrizione: 'Consegna in 1-2 giorni lavorativi', costo: 5.99, giorni: '1-2 gg' },
    { valore: 'SAME_DAY', etichetta: 'Same Day',  descrizione: 'Consegna entro oggi (ordini entro le 12:00)', costo: 9.99, giorni: 'oggi' },
    { valore: 'RITIRO',   etichetta: 'Ritiro in negozio', descrizione: 'Ritira direttamente in negozio', costo: 0, giorni: '' },
  ];

  tipoSpedizioneSelezionato = signal<TipoSpedizioneOption>(this.opzioniSpedizione[0]);

  costoSpedizione = computed(() => this.tipoSpedizioneSelezionato().costo);

  // IVA fissa 22%
  readonly ALIQUOTA_IVA = 0.22;

  imponibile = computed(() => {
    const sub = this.subtotale() + this.costoSpedizione();
    return sub / (1 + this.ALIQUOTA_IVA);
  });

  iva = computed(() => this.subtotale() + this.costoSpedizione() - this.imponibile());

  totale = computed(() => this.subtotale() + this.costoSpedizione());

  // ── Form spedizione ───────────────────────────────────
  form: SpedizioneForm = {
    nome: '', cognome: '', email: '', telefono: '',
    indirizzo: '', citta: '', provincia: '', cap: '',
    noteSpedizione: '',
  };

  erroriForm: Partial<Record<keyof SpedizioneForm, string>> = {};

  // ── Invio ordine ──────────────────────────────────────
  invioInCorso = signal(false);
  erroreInvio = signal<string | null>(null);
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
    if (items.length === 0) {
      this.router.navigate(['/carrello']);
      return;
    }
    this.items.set(items);

    // Pre-compila email/nome dal profilo utente
    this.accountService.getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(acc => {
        this.account = acc;
        if (acc) {
          this.form.email = acc.email ?? '';
          this.form.nome  = acc.firstName ?? '';
          this.form.cognome = acc.lastName ?? '';
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ── Navigazione step ──────────────────────────────────
  avanti(): void {
    if (this.step() === 'spedizione') {
      if (!this.validaForm()) return;
      this.step.set('riepilogo');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  indietro(): void {
    if (this.step() === 'riepilogo') {
      this.step.set('spedizione');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  selezionaSpedizione(opzione: TipoSpedizioneOption): void {
    this.tipoSpedizioneSelezionato.set(opzione);
  }

  // ── Validazione ───────────────────────────────────────
  private validaForm(): boolean {
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
    else if (!/^\d{5}$/.test(f.cap)) this.erroriForm.cap = 'CAP non valido (5 cifre)';

    return Object.keys(this.erroriForm).length === 0;
  }

  // ── Conferma ordine ───────────────────────────────────
  confermaOrdine(): void {
    this.invioInCorso.set(true);
    this.erroreInvio.set(null);

    const spedizione = this.tipoSpedizioneSelezionato();
    const f = this.form;

    // clienteId: UUID placeholder (in produzione viene dal JWT)
    const clienteId = this.account
      ? '00000000-0000-0000-0000-000000000001'
      : '00000000-0000-0000-0000-000000000000';

    const ordinePayload = {
      clienteId,
      nomeCliente:    f.nome.trim(),
      cognomeCliente: f.cognome.trim(),
      email:          f.email.trim(),
      telefono:       f.telefono.trim() || null,
      indirizzo:      f.indirizzo.trim(),
      citta:          f.citta.trim(),
      provincia:      f.provincia.trim().toUpperCase(),
      cap:            f.cap.trim(),
      statoPaese:     'Italia',
      noteSpedizione: f.noteSpedizione.trim() || null,
      tipoSpedizione: spedizione.valore,
      costoSpedizione: spedizione.costo,
      totaleImponibile: +this.imponibile().toFixed(2),
      totaleIva:        +this.iva().toFixed(2),
      totaleFinal:      +this.totale().toFixed(2),
      statoOrdine:     'IN_ELABORAZIONE',
    };

    // Step 1: crea ordine
    this.http.post<{ id: string; numeroOrdine: string }>(
      '/services/msordini/api/ordines', ordinePayload
    ).pipe(
      catchError(err => {
        const msg = err?.error?.detail ?? 'Errore durante la creazione dell\'ordine.';
        this.erroreInvio.set(msg);
        this.invioInCorso.set(false);
        return of(null);
      }),
      switchMap(ordine => {
        if (!ordine) return of(null);

        this.numeroOrdineCreato.set(ordine.numeroOrdine);

        // Step 2: crea righe ordine in parallelo
        const righe = this.items().map(item => ({
          prodottoId:    item.id,
          nomeProdotto:  item.nome,
          prezzoUnitario: item.prezzo,
          quantita:       item.quantita,
          prezzoTotale:   +(item.prezzo * item.quantita).toFixed(2),
          aliquotaIva:    this.ALIQUOTA_IVA,
          ordine: { id: ordine.id },
        }));

        // Manda le righe in sequenza (forkJoin in parallelo potrebbe sovraccaricare)
        const righeObs = righe.map(r =>
          this.http.post('/services/msordini/api/riga-ordines', r).pipe(
            catchError(() => of(null))
          )
        );

        // Usa forkJoin-like manuale con reduce
        return righeObs.reduce(
          (acc$, riga$) => acc$.pipe(switchMap(() => riga$)),
          of(null) as ReturnType<typeof of>
        );
      }),
      takeUntil(this.destroy$)
    ).subscribe(result => {
      if (this.numeroOrdineCreato()) {
        this.invioInCorso.set(false);
        this.carrelloService.svuota();
        this.step.set('successo');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  // ── Utility ───────────────────────────────────────────
  formatPrice(p: number): string {
    return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(p);
  }

  getImmagine(item: CarrelloItem): string {
    return item.immagineUrl || '';
  }

  tornaAlCatalogo(): void {
    this.router.navigate(['/catalogo']);
  }

  vaiAiMieiOrdini(): void {
    this.router.navigate(['/ordini']);
  }
}
