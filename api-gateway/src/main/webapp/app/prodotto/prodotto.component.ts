import { Component, NgZone, OnInit, inject, signal } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Data, ParamMap, Router, RouterModule } from '@angular/router';
import { Observable, Subscription, combineLatest, filter, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import SharedModule from 'app/shared/shared.module';
import { SortByDirective, SortDirective, SortService, type SortState, sortStateSignal } from 'app/shared/sort';
import { ItemCountComponent } from 'app/shared/pagination';
import { ITEMS_PER_PAGE, PAGE_HEADER, TOTAL_COUNT_RESPONSE_HEADER } from 'app/config/pagination.constants';
import { DEFAULT_SORT_DATA, ITEM_DELETED_EVENT, SORT } from 'app/config/navigation.constants';
import { DataUtils } from 'app/core/util/data-util.service';
import { FilterComponent, FilterOptions, IFilterOption, IFilterOptions } from 'app/shared/filter';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';

import { EntityArrayResponseType, ProdottoService } from '../service/prodotto.service';
import { CategoriaService } from '../../categoria/service/categoria.service';
import { ProdottoDeleteDialogComponent } from '../delete/prodotto-delete-dialog.component';
import { IProdotto } from '../prodotto.model';
import { ICategoria } from '../../categoria/categoria.model';

// -------------------------------------------------------
// Numero di prodotti per pagina nel catalogo
// Cambia questo valore per adattarlo alle esigenze del cliente
// -------------------------------------------------------
const CATALOGO_PAGE_SIZE = 12;

@Component({
  selector: 'jhi-prodotto',
  templateUrl: './prodotto.component.html',
  styleUrl: './prodotto.component.scss',
  imports: [RouterModule, FormsModule, DecimalPipe, SharedModule, SortDirective, SortByDirective, FilterComponent, ItemCountComponent],
})
export class ProdottoComponent implements OnInit {
  subscription: Subscription | null = null;

  // ---- Dati ----
  prodottos = signal<IProdotto[]>([]);
  categorie = signal<ICategoria[]>([]);
  account = signal<Account | null>(null);
  isLoading = false;

  // ---- JHipster: sort / filtri / paginazione ----
  sortState = sortStateSignal({});
  filters: IFilterOptions = new FilterOptions();
  itemsPerPage = CATALOGO_PAGE_SIZE;
  totalItems = 0;
  page = 1;

  // ---- Filtri locali (sidebar) ----
  searchNome = '';
  selectedCategoriaId: number | null = null;
  soloInEvidenza = false;
  soloDisponibili = false;
  prezzoFiltro = 500;         // valore iniziale slider
  prezzoMax = 500;            // aggiornato dopo il primo caricamento
  currentSort = 'nome,asc';

  // ---- Dipendenze ----
  public readonly router = inject(Router);
  protected readonly prodottoService = inject(ProdottoService);
  protected readonly categoriaService = inject(CategoriaService);
  protected readonly activatedRoute = inject(ActivatedRoute);
  protected readonly sortService = inject(SortService);
  protected dataUtils = inject(DataUtils);
  protected modalService = inject(NgbModal);
  protected ngZone = inject(NgZone);
  private readonly accountService = inject(AccountService);

  trackId = (item: IProdotto): number => this.prodottoService.getProdottoIdentifier(item);

  // -------------------------------------------------------
  // Lifecycle
  // -------------------------------------------------------
  ngOnInit(): void {
    // Autenticazione (per mostrare i pulsanti admin)
    this.accountService.getAuthenticationState().subscribe(acc => this.account.set(acc));

    // Carica le categorie per la sidebar
    this.loadCategorie();

    // Lettura parametri URL → caricamento prodotti (JHipster standard)
    this.subscription = combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data])
      .pipe(
        tap(([params, data]) => this.fillComponentAttributeFromRoute(params, data)),
        tap(() => this.load()),
      )
      .subscribe();

    this.filters.filterChanges.subscribe(filterOptions => this.handleNavigation(1, this.sortState(), filterOptions));
  }

  // -------------------------------------------------------
  // Caricamento dati
  // -------------------------------------------------------
  load(): void {
    this.queryBackend().subscribe({
      next: (res: EntityArrayResponseType) => this.onResponseSuccess(res),
    });
  }

  private loadCategorie(): void {
    this.categoriaService.query({ size: 200 }).subscribe({
      next: res => this.categorie.set(res.body ?? []),
    });
  }

  // -------------------------------------------------------
  // Filtri sidebar
  // -------------------------------------------------------

  /** Chiamato dal campo di ricerca (con debounce minimale) */
  private searchTimeout: ReturnType<typeof setTimeout> | null = null;
  onSearchChange(): void {
    if (this.searchTimeout) clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => this.applyFilters(), 350);
  }

  onSortChange(): void {
    const [predicate, order] = this.currentSort.split(',');
    this.handleNavigation(1, { predicate, order: order as 'asc' | 'desc' });
  }

  applyFilters(): void {
    this.handleNavigation(1, this.sortState(), this.buildFilterOptions());
  }

  resetFilters(): void {
    this.searchNome = '';
    this.selectedCategoriaId = null;
    this.soloInEvidenza = false;
    this.soloDisponibili = false;
    this.prezzoFiltro = this.prezzoMax;
    this.applyFilters();
  }

  hasActiveFilters(): boolean {
    return (
      !!this.searchNome ||
      this.selectedCategoriaId !== null ||
      this.soloInEvidenza ||
      this.soloDisponibili ||
      this.prezzoFiltro < this.prezzoMax
    );
  }

  // -------------------------------------------------------
  // Delete (JHipster standard)
  // -------------------------------------------------------
  delete(prodotto: IProdotto): void {
    const modalRef = this.modalService.open(ProdottoDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.prodotto = prodotto;
    modalRef.closed
      .pipe(
        filter(reason => reason === ITEM_DELETED_EVENT),
        tap(() => this.load()),
      )
      .subscribe();
  }

  // -------------------------------------------------------
  // Navigazione paginazione
  // -------------------------------------------------------
  navigateToWithComponentValues(event: SortState): void {
    this.handleNavigation(this.page, event, this.filters.filterOptions);
  }

  navigateToPage(page: number): void {
    this.handleNavigation(page, this.sortState(), this.filters.filterOptions);
  }

  // -------------------------------------------------------
  // Utility helpers (compatibili con la home)
  // -------------------------------------------------------

  /**
   * Formatta un prezzo in Euro con localizzazione italiana.
   * Usato anche nella home — mantieni la stessa firma.
   */
  formatPrice(price: number | null | undefined): string {
    if (price == null) return '—';
    return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(price);
  }

  /**
   * Restituisce un array di 5 booleani per renderizzare le stelle.
   * true = stella piena, false = stella vuota.
   */
  getStarsArray(voto: number | null | undefined): boolean[] {
    const v = Math.round(voto ?? 0);
    return Array.from({ length: 5 }, (_, i) => i < v);
  }

  /**
   * URL immagine con fallback al placeholder.
   * Cambia il percorso del placeholder secondo le esigenze del cliente.
   */
  getImmagine(prodotto: IProdotto): string {
    if (prodotto.immagineUrl) return prodotto.immagineUrl;
    return '/content/images/prodotto-placeholder.svg';
  }

  /** Il prodotto è disponibile se quantitaDisponibile > 0 (o se il campo è null = non gestito) */
  isDisponibile(prodotto: IProdotto): boolean {
    return prodotto.quantitaDisponibile == null || prodotto.quantitaDisponibile > 0;
  }

  // -------------------------------------------------------
  // Metodi JHipster (non modificare)
  // -------------------------------------------------------
  protected fillComponentAttributeFromRoute(params: ParamMap, data: Data): void {
    const page = params.get(PAGE_HEADER);
    this.page = +(page ?? 1);
    this.sortState.set(this.sortService.parseSortParam(params.get(SORT) ?? data[DEFAULT_SORT_DATA]));
    this.filters.initializeFromParams(params);
    // Ripristina il sort select dall'URL
    const sortParam = params.get(SORT);
    if (sortParam) this.currentSort = sortParam;
  }

  protected onResponseSuccess(response: EntityArrayResponseType): void {
    this.fillComponentAttributesFromResponseHeader(response.headers);
    const data = response.body ?? [];
    this.prodottos.set(data);

    // Aggiorna il prezzo massimo dello slider al primo caricamento
    if (this.prezzoMax === 500 && data.length > 0) {
      const maxFound = Math.max(...data.map(p => p.prezzo ?? 0));
      if (maxFound > 0) {
        this.prezzoMax = Math.ceil(maxFound / 10) * 10;
        this.prezzoFiltro = this.prezzoMax;
      }
    }
  }

  protected fillComponentAttributesFromResponseHeader(headers: HttpHeaders): void {
    this.totalItems = Number(headers.get(TOTAL_COUNT_RESPONSE_HEADER));
  }

  protected queryBackend(): Observable<EntityArrayResponseType> {
    const { page, filters } = this;
    this.isLoading = true;

    const [predicate, order] = this.currentSort.split(',');
    const queryObject: Record<string, unknown> = {
      page: page - 1,
      size: this.itemsPerPage,
      eagerload: true,
      sort: [`${predicate},${order}`],
    };

    // Filtri server-side supportati da JHipster (jpaMetamodelFiltering = true)
    if (this.searchNome) {
      queryObject['nome.contains'] = this.searchNome;
    }
    if (this.selectedCategoriaId !== null) {
      queryObject['categoriaId.equals'] = this.selectedCategoriaId;
    }
    if (this.soloInEvidenza) {
      queryObject['inEvidenza.equals'] = true;
    }
    if (this.prezzoFiltro < this.prezzoMax) {
      queryObject['prezzo.lessThanOrEqual'] = this.prezzoFiltro;
    }
    if (this.soloDisponibili) {
      queryObject['quantitaDisponibile.greaterThan'] = 0;
    }

    filters.filterOptions.forEach(fo => {
      queryObject[fo.name] = fo.values;
    });

    return this.prodottoService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
  }

  protected handleNavigation(page: number, sortState: SortState, filterOptions?: IFilterOption[]): void {
    const queryParamsObj: Record<string, unknown> = {
      page,
      size: this.itemsPerPage,
      sort: this.sortService.buildSortParam(sortState),
    };
    filterOptions?.forEach(fo => {
      queryParamsObj[fo.nameAsQueryParam()] = fo.values;
    });
    this.ngZone.run(() => {
      this.router.navigate(['./'], {
        relativeTo: this.activatedRoute,
        queryParams: queryParamsObj,
      });
    });
  }

  // -------------------------------------------------------
  // Costruisce i FilterOption per la navigazione URL
  // -------------------------------------------------------
  private buildFilterOptions(): IFilterOption[] {
    return this.filters.filterOptions;
  }
}
