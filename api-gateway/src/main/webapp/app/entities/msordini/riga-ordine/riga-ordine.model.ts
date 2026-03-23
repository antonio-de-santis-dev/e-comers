import { IOrdine } from 'app/entities/msordini/ordine/ordine.model';

export interface IRigaOrdine {
  id: number;
  prodottoId?: string | null;
  nomeProdotto?: string | null;
  quantita?: number | null;
  prezzoUnitario?: number | null;
  totaleRiga?: number | null;
  ordine?: Pick<IOrdine, 'id'> | null;
}

export type NewRigaOrdine = Omit<IRigaOrdine, 'id'> & { id: null };
