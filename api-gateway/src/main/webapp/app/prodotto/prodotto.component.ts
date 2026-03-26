import { Component, NgZone, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Data, ParamMap, Router, RouterModule } from '@angular/router';
import { Observable, Subscription, Subject, combineLatest, filter, tap } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
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

import { EntityArrayResponseType, ProdottoService } from '../entities/mscatalogo/prodotto/service/prodotto.service';
import { CategoriaService } from '../entities/mscatalogo/categoria/service/categoria.service';
import { ProdottoDeleteDialogComponent } from '../entities/mscatalogo/prodotto/delete/prodotto-delete-dialog.component';
import { IProdotto } from '../entities/mscatalogo/prodotto/prodotto.model';
import { ICategoria } from '../entities/mscatalogo/categoria/categoria.model';
import { CarrelloService } from 'app/negozio/carrello/carrello.service';

const CATALOGO_PAGE_SIZE = 12;

@Component({
  selector: 'jhi-prodotto',
  templateUrl: './prodotto.component.html',
  styleUrl: './prodotto.component.scss',
  imports: [RouterModule, FormsModule, DecimalPipe, SharedModule, ItemCountComponent],
})
export class ProdottoComponent implements OnInit, OnDestroy {
  subscription: Subscription | null = null;
  private readonly destroy$ = new Subject<void>();

  prodottos = signal<IProdotto[]>([]);
  categorie = signal<ICategoria[]>([]);
  account = signal<Account | null>(null);
  isLoading = false;

  sortState = sortStateSignal({});
  filters: IFilterOptions = new FilterOptions();
  itemsPerPage = CATALOGO_PAGE_SIZE;
  totalItems = 0;
  page = 1;

  searchNome = '';
  selectedCategoriaId: number | null = null;
  soloInEvidenza = false;
  soloDisponibili = false;
  prezzoFiltro = 500;
  prezzoMax = 500;
  currentSort = 'nome,asc';

  // Subject RxJS per la ricerca nome — NON passa per il router
  // Permette di digitare liberamente: debounce 500ms, poi load()
  private readonly searchSubject = new Subject<string>();

  public readonly router = inject(Router);
  protected readonly prodottoService = inject(ProdottoService);
  protected readonly categoriaService = inject(CategoriaService);
  protected readonly activatedRoute = inject(ActivatedRoute);
  protected readonly sortService = inject(SortService);
  protected dataUtils = inject(DataUtils);
  protected modalService = inject(NgbModal);
  protected ngZone = inject(NgZone);
  private readonly accountService = inject(AccountService);

  trackId = (item: IProdotto): any => this.prodottoService.getProdottoIdentifier(item);

  ngOnInit(): void {
    this.accountService.getAuthenticationState().subscribe(acc => this.account.set(acc));
    this.loadCategorie();

    // Ricerca nome con Subject RxJS + debounce 500ms
    // Quando il valore cambia: aggiorna searchNome e chiama load() direttamente
    // NON passa per il router cosi la digitazione non viene interrotta
    this.searchSubject.pipe(
      debounceTime(500),
      distinctUntilChanged(),
    ).subscribe(value => {
      this.searchNome = value;
      this.page = 1;
      this.load();
    });

    // Caricamento iniziale e paginazione via router (JHipster standard)
    this.subscription = combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data])
      .pipe(
        tap(([params, data]) => this.fillComponentAttributeFromRoute(params, data)),
        tap(() => this.load()),
      )
      .subscribe();

    this.filters.filterChanges.subscribe(filterOptions => this.handleNavigation(1, this.sortState(), filterOptions));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.subscription?.unsubscribe();
  }

  load(): void {
    this.queryBackend().subscribe({
      next: (res: EntityArrayResponseType) => this.onResponseSuccess(res),
    });
  }

  private loadCategorie(): void {
    this.categoriaService.query({ size: 200 }).subscribe({
      next: (res: any) => this.categorie.set(res.body ?? []),
    });
  }

  // Chiamato da (input) — emette nel Subject senza toccare il router
  onSearchChange(): void {
    this.searchSubject.next(this.searchNome);
  }

  // Reset campo nome — bottone X o tasto ESC
  resetSearch(): void {
    this.searchNome = '';
    this.searchSubject.next('');
  }

  onSortChange(): void {
    const [predicate, order] = this.currentSort.split(',');
    this.handleNavigation(1, { predicate, order: order as 'asc' | 'desc' });
  }

  // Applica gli altri filtri (categoria, prezzo, disponibilita, evidenza)
  applyFilters(): void {
    this.page = 1;
    this.load();
  }

  resetFilters(): void {
    this.searchNome = '';
    this.searchSubject.next('');
    this.selectedCategoriaId = null;
    this.soloInEvidenza = false;
    this.soloDisponibili = false;
    this.prezzoFiltro = this.prezzoMax;
    this.page = 1;
    this.load();
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

  aggiungiAlCarrello(prodotto: IProdotto): void {
    console.log('Aggiungi al carrello:', prodotto.id, prodotto.nome);
  }

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

  navigateToWithComponentValues(event: SortState): void {
    this.handleNavigation(this.page, event, this.filters.filterOptions);
  }

  navigateToPage(page: number): void {
    this.page = page;
    this.load();
  }

  formatPrice(price: number | null | undefined): string {
    if (price == null) return '—';
    return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(price);
  }

  getStarsArray(voto: number | null | undefined): boolean[] {
    const v = Math.round(voto ?? 0);
    return Array.from({ length: 5 }, (_, i) => i < v);
  }

  getImmagine(prodotto: IProdotto): string {
    return 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiB2aWV3Qm94PSIwIDAgNDAwIDQwMCI+CiAgPHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9IiNmNWY1ZjUiLz4KICA8cmVjdCB4PSIxMjAiIHk9IjEwMCIgd2lkdGg9IjE2MCIgaGVpZ2h0PSIxMjAiIHJ4PSIxMiIgZmlsbD0iI2UwZTBlMCIvPgogIDxjaXJjbGUgY3g9IjIwMCIgY3k9IjI4MCIgcj0iNDAiIGZpbGw9IiNlMGUwZTAiLz4KICA8dGV4dCB4PSIyMDAiIHk9IjM3MCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiNiYmIiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkltbWFnaW5lIHByb2RvdHRvPC90ZXh0Pgo8L3N2Zz4=';
  }

  isDisponibile(prodotto: IProdotto): boolean {
    return prodotto.quantitaDisponibile == null || prodotto.quantitaDisponibile > 0;
  }

  protected fillComponentAttributeFromRoute(params: ParamMap, data: Data): void {
    const page = params.get(PAGE_HEADER);
    this.page = +(page ?? 1);
    this.sortState.set(this.sortService.parseSortParam(params.get(SORT) ?? data[DEFAULT_SORT_DATA]));
    this.filters.initializeFromParams(params);
    const sortParam = params.get(SORT);
    if (sortParam) this.currentSort = sortParam;
    // NON resettare searchNome — gestito solo dal searchSubject
  }

  protected onResponseSuccess(response: EntityArrayResponseType): void {
    this.fillComponentAttributesFromResponseHeader(response.headers);
    const data = response.body ?? [];
    this.prodottos.set(data);

    if (this.prezzoMax === 500 && data.length > 0) {
      const maxFound = Math.max(...data.map((p: IProdotto) => p.prezzo ?? 0));
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
    this.isLoading = true;
    const [predicate, order] = this.currentSort.split(',');
    const queryObject: Record<string, unknown> = {
      page: this.page - 1,
      size: this.itemsPerPage,
      eagerload: true,
      sort: [`${predicate},${order}`],
    };

    if (this.searchNome && this.searchNome.trim()) {
      queryObject['nome.contains'] = this.searchNome.trim();
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

    this.filters.filterOptions.forEach(fo => {
      queryObject[fo.name] = fo.values;
    });

    return (this.prodottoService as any).query(queryObject).pipe(tap(() => (this.isLoading = false)));
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

  private buildFilterOptions(): IFilterOption[] {
    return this.filters.filterOptions;
  }
}
