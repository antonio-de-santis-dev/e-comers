import { ICategoria } from 'app/entities/mscatalogo/categoria/categoria.model';

export interface IProdotto {
  id: number;
  nome?: string | null;
  descrizione?: string | null;
  prezzo?: number | null;
  quantitaDisponibile?: number | null;
  inEvidenza?: boolean | null;
  immagineUrl?: string | null;
  votaMedio?: number | null;
  categoria?: Pick<ICategoria, 'id' | 'nome'> | null;
}

export type NewProdotto = Omit<IProdotto, 'id'> & { id: null };
