import { ICategoria } from 'app/entities/mscatalogo/categoria/categoria.model';

export interface IProdotto {
  id: string;              // UUID — stringa (non number)
  nome?: string | null;
  descrizione?: string | null;
  prezzo?: number | null;
  quantitaDisponibile?: number | null;
  inEvidenza?: boolean | null;
  immagineUrl?: string | null;
  votoTotale?: number | null;   // ← era "votaMedio" ma il JDL/backend usa "votoTotale"
  totalePurchased?: number | null;
  categoria?: Pick<ICategoria, 'id' | 'nome'> | null;
}

export type NewProdotto = Omit<IProdotto, 'id'> & { id: null };
