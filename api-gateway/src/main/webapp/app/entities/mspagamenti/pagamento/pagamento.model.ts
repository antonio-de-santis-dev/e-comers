import dayjs from 'dayjs/esm';
import { MetodoPagamento } from 'app/entities/enumerations/metodo-pagamento.model';
import { StatoPagamento } from 'app/entities/enumerations/stato-pagamento.model';

export interface IPagamento {
  id: number;
  ordineId?: string | null;
  importo?: number | null;
  metodoPagamento?: keyof typeof MetodoPagamento | null;
  statoPagamento?: keyof typeof StatoPagamento | null;
  dataOperazione?: dayjs.Dayjs | null;
  transazioneId?: string | null;
  note?: string | null;
}

export type NewPagamento = Omit<IPagamento, 'id'> & { id: null };
