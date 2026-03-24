import { Injectable, signal, computed } from '@angular/core';

// -------------------------------------------------------
//  Interfaccia item carrello
// -------------------------------------------------------
export interface CarrelloItem {
  id: number;
  nome: string;
  prezzo: number;
  quantita: number;
  immagineUrl?: string | null;
  categoriaId?: number | null;
}

// -------------------------------------------------------
//  CarrelloService — singleton, stato in memoria.
//  TODO: persistere in localStorage o nel backend
//        quando il microservizio ordini è pronto.
// -------------------------------------------------------
@Injectable({ providedIn: 'root' })
export class CarrelloService {

  private readonly _items = signal<CarrelloItem[]>([]);

  // Signal pubblico (sola lettura)
  readonly items = this._items.asReadonly();

  readonly totaleArticoli = computed(() =>
    this._items().reduce((s, i) => s + i.quantita, 0)
  );

  readonly totale = computed(() =>
    this._items().reduce((s, i) => s + i.prezzo * i.quantita, 0)
  );

  // ---- Metodi ----

  aggiungi(prodotto: { id: number; nome?: string | null; prezzo?: number | null; immagineUrl?: string | null; categoriaId?: number | null }): void {
    this._items.update(items => {
      const existing = items.find(i => i.id === prodotto.id);
      if (existing) {
        return items.map(i =>
          i.id === prodotto.id ? { ...i, quantita: i.quantita + 1 } : i
        );
      }
      return [
        ...items,
        {
          id: prodotto.id,
          nome: prodotto.nome ?? `Prodotto ${prodotto.id}`,
          prezzo: prodotto.prezzo ?? 0,
          quantita: 1,
          immagineUrl: prodotto.immagineUrl,
          categoriaId: prodotto.categoriaId ?? null,
        },
      ];
    });
  }

  rimuovi(id: number): void {
    this._items.update(items => items.filter(i => i.id !== id));
  }

  modificaQuantita(id: number, quantita: number): void {
    if (quantita <= 0) {
      this.rimuovi(id);
      return;
    }
    this._items.update(items =>
      items.map(i => (i.id === id ? { ...i, quantita } : i))
    );
  }

  svuota(): void {
    this._items.set([]);
  }

  getItems(): CarrelloItem[] {
    return this._items();
  }
}
