import dayjs from 'dayjs/esm';

export interface IStatisticaOrdine {
  id: number;
  ordineId?: string | null;
  importoTotale?: number | null;
  statoOrdine?: string | null;
  microservizio?: string | null;
  dataRegistrazione?: dayjs.Dayjs | null;
  note?: string | null;
}

export type NewStatisticaOrdine = Omit<IStatisticaOrdine, 'id'> & { id: null };
