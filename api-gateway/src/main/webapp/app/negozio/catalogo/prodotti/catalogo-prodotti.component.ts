import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Subject, of } from 'rxjs';
import { takeUntil, catchError } from 'rxjs/operators';
import SharedModule from 'app/shared/shared.module';
import { DecimalPipe } from '@angular/common';

interface Prodotto {
  id: string;
  nome: string;
  descrizione?: string | null;
  prezzo?: number | null;
  immagineCopertina?: string | null;
  immagineCopertinaContentType?: string | null;
  disponibile?: boolean | null;
  quantitaDisponibile?: number | null;
  inEvidenza?: boolean | null;
  votoTotale?: number | null;
  categoria?: { id: number; nome: string } | null;
}

interface CategoriaItem {
  id: number;
  nome: string;
}

@Component({
  selector: 'jhi-catalogo-prodotti',
  standalone: true,
  imports: [SharedModule, FormsModule, RouterModule, DecimalPipe],
  templateUrl: './catalogo-prodotti.component.html',
  styleUrl: './catalogo-prodotti.component.scss',
})
export default class CatalogoProdottiComponent implements OnInit, OnDestroy {

  prodotti = signal<Prodotto[]>([]);
  loading = signal(true);
  totale = signal(0);

  // Filtri sidebar
  ricerca = signal('');
  categoriaId = signal<string | null>(null);
  nomeCategoria = signal<string | null>(null);
  ordinamento = signal('nome,asc');
  soloEvidenza = signal(false);
  soloDisponibili = signal(false);
  prezzoMax = signal<number>(1900);
  readonly PREZZO_MAX_ASSOLUTO = 1900;

  // Lista categorie per sidebar
  categorie = signal<CategoriaItem[]>([]);

  // Paginazione
  pagina = signal(0);
  readonly PAGE_SIZE = 12;

  private readonly destroy$ = new Subject<void>();
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly http = inject(HttpClient);

  readonly PLACEHOLDER = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiB2aWV3Qm94PSIwIDAgNDAwIDQwMCI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9IiNmNWY1ZjUiLz48cmVjdCB4PSIxMjAiIHk9IjEwMCIgd2lkdGg9IjE2MCIgaGVpZ2h0PSIxMjAiIHJ4PSIxMiIgZmlsbD0iI2UwZTBlMCIvPjxjaXJjbGUgY3g9IjIwMCIgY3k9IjI4MCIgcj0iNDAiIGZpbGw9IiNlMGUwZTAiLz48dGV4dCB4PSIyMDAiIHk9IjM3MCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiNiYmIiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkltbWFnaW5lIHByb2RvdHRvPC90ZXh0Pjwvc3ZnPg==';

  ngOnInit(): void {
    this.caricaCategorie();
    this.route.queryParamMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const cat = params.get('categoriaId.equals');
      this.categoriaId.set(cat);
      this.pagina.set(0);
      this.caricaProdotti();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ── Caricamento categorie per la sidebar ──────────────────────
  private caricaCategorie(): void {
    this.http
      .get<CategoriaItem[]>('/services/mscatalogo/api/categorias', { params: { size: '200' } })
      .pipe(catchError(() => of([])), takeUntil(this.destroy$))
      .subscribe(cats => this.categorie.set(cats));
  }

  // ── Caricamento prodotti con tutti i filtri ───────────────────
  caricaProdotti(): void {
    this.loading.set(true);
    const params: Record<string, string> = {
      page: this.pagina().toString(),
      size: this.PAGE_SIZE.toString(),
      sort: this.ordinamento(),
    };

    if (this.categoriaId()) params['categoriaId.equals'] = this.categoriaId()!;
    if (this.ricerca().trim().length >= 2) params['nome.contains'] = this.ricerca().trim();
    if (this.soloEvidenza()) params['inEvidenza.equals'] = 'true';
    if (this.soloDisponibili()) params['disponibile.equals'] = 'true';
    if (this.prezzoMax() < this.PREZZO_MAX_ASSOLUTO) {
      params['prezzo.lessThanOrEqual'] = this.prezzoMax().toString();
    }

    this.http.get<Prodotto[]>('/services/mscatalogo/api/prodottos', {
      params,
      observe: 'response',
    }).pipe(
      catchError(() => of(null)),
      takeUntil(this.destroy$),
    ).subscribe(res => {
      if (res) {
        this.prodotti.set(res.body ?? []);
        const tot = res.headers.get('X-Total-Count');
        this.totale.set(tot ? parseInt(tot, 10) : 0);

        const first = res.body?.[0];
        if (first?.categoria?.nome && this.categoriaId()) {
          this.nomeCategoria.set(first.categoria.nome);
        } else {
          this.nomeCategoria.set(null);
        }
      }
      this.loading.set(false);
    });
  }

  // ── Handler filtri ────────────────────────────────────────────
  onRicercaChange(val: string): void {
    this.ricerca.set(val);
    this.pagina.set(0);
    this.caricaProdotti();
  }

  onOrdinamentoChange(val: string): void {
    this.ordinamento.set(val);
    this.pagina.set(0);
    this.caricaProdotti();
  }

  onCategoriaChange(id: string | null): void {
    this.categoriaId.set(id);
    this.pagina.set(0);
    if (id) {
      this.router.navigate([], { queryParams: { 'categoriaId.equals': id }, queryParamsHandling: 'merge' });
    } else {
      this.router.navigate([], { queryParams: {} });
    }
    this.caricaProdotti();
  }

  onEvidenzaChange(val: boolean): void {
    this.soloEvidenza.set(val);
    this.pagina.set(0);
    this.caricaProdotti();
  }

  onDisponibiliChange(val: boolean): void {
    this.soloDisponibili.set(val);
    this.pagina.set(0);
    this.caricaProdotti();
  }

  onPrezzoMaxChange(val: number): void {
    this.prezzoMax.set(val);
    this.pagina.set(0);
    this.caricaProdotti();
  }

  // ── Paginazione ───────────────────────────────────────────────
  paginaPrecedente(): void {
    if (this.pagina() > 0) {
      this.pagina.update(p => p - 1);
      this.caricaProdotti();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  paginaSuccessiva(): void {
    if ((this.pagina() + 1) * this.PAGE_SIZE < this.totale()) {
      this.pagina.update(p => p + 1);
      this.caricaProdotti();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  get paginaCorrente(): number { return this.pagina() + 1; }
  get totalePagine(): number { return Math.ceil(this.totale() / this.PAGE_SIZE); }
  get hasPrev(): boolean { return this.pagina() > 0; }
  get hasNext(): boolean { return (this.pagina() + 1) * this.PAGE_SIZE < this.totale(); }

  // ── Helpers ───────────────────────────────────────────────────
  getImmagine(p: Prodotto): string {
    if (p.immagineCopertina && p.immagineCopertina.length > 10 && p.immagineCopertinaContentType) {
      return `data:${p.immagineCopertinaContentType};base64,${p.immagineCopertina}`;
    }
    return this.PLACEHOLDER;
  }

  getStelle(voto: number | null | undefined): string[] {
    const v = Math.round(voto ?? 0);
    return Array.from({ length: 5 }, (_, i) => i < v ? '★' : '☆');
  }

  formatPrezzo(p: number | null | undefined): string {
    if (p == null) return '—';
    return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(p);
  }

  tornaAlCatalogo(): void {
    this.router.navigate(['/catalogo']);
  }
}
