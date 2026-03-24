import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { takeUntil, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import SharedModule from 'app/shared/shared.module';

// -------------------------------------------------------
//  Interfaccia locale Categoria (rispecchia ICategoria)
// -------------------------------------------------------
interface CatalogoItem {
  id: number | 'tutti';
  nome: string;
  descrizione: string;
  emoji: string;
  totProdotti?: number;
}

// -------------------------------------------------------
//  CONFIGURAZIONE — modifica qui emoji e descrizioni
//  Le categorie reali vengono caricate dal microservizio.
//  Se vuoi sovrascrivere emoji/descrizione per una
//  categoria specifica, aggiungi una voce in EMOJI_MAP.
// -------------------------------------------------------
const EMOJI_MAP: Record<string, string> = {
  // 'NomeCategoria': '🌿',   // ← aggiungi qui le tue mappature
};
const EMOJI_DEFAULT = '📦';

@Component({
  selector: 'jhi-catalogo',
  standalone: true,
  imports: [RouterModule, SharedModule],
  templateUrl: './catalogo.component.html',
  styleUrl: './catalogo.component.scss',
})
export default class CatalogoComponent implements OnInit, OnDestroy {

  // ---- State ----
  cataloghi = signal<CatalogoItem[]>([]);
  isLoading = signal(true);
  totProdotti = signal(0);

  // ---- Deps ----
  private readonly destroy$ = new Subject<void>();
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  // ---- Lifecycle ----
  ngOnInit(): void {
    this.loadCataloghi();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ---- Caricamento categorie dal microservizio ----
  private loadCataloghi(): void {
    this.isLoading.set(true);

    this.http
      .get<{ id: number; nome?: string | null; descrizione?: string | null }[]>(
        '/services/mscatalogo/api/categorias',
        { params: { size: '200' } }
      )
      .pipe(
        catchError(() => of([])),
        takeUntil(this.destroy$)
      )
      .subscribe(cats => {
        // Voce "Tutti i prodotti" sempre in cima
        const tuttiItem: CatalogoItem = {
          id: 'tutti',
          nome: 'Tutti i prodotti',
          descrizione: 'Sfoglia tutto il catalogo',
          emoji: '🛍️',
        };

        const vociCategorie: CatalogoItem[] = cats.map(c => ({
          id: c.id,
          nome: c.nome ?? `Categoria ${c.id}`,
          descrizione: c.descrizione ?? '',
          emoji: EMOJI_MAP[c.nome ?? ''] ?? EMOJI_DEFAULT,
        }));

        this.cataloghi.set([tuttiItem, ...vociCategorie]);
        this.isLoading.set(false);
      });

    // Carica il totale prodotti per il contatore in fondo
    this.http
      .get<unknown[]>('/services/mscatalogo/api/prodottos', { params: { size: '1' }, observe: 'response' })
      .pipe(
        catchError(() => of(null)),
        takeUntil(this.destroy$)
      )
      .subscribe((res: any) => {
        if (res) {
          const total = Number(res.headers?.get('X-Total-Count') ?? 0);
          this.totProdotti.set(total);
        }
      });
  }

  // ---- Navigazione ----
  vaiALista(cat: CatalogoItem): void {
    if (cat.id === 'tutti') {
      this.router.navigate(['/catalogo/prodotti']);
    } else {
      this.router.navigate(['/catalogo/prodotti'], {
        queryParams: { 'categoriaId.equals': cat.id },
      });
    }
  }
}
