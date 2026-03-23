import dayjs from 'dayjs/esm';
import { TipoSpedizione } from 'app/entities/enumerations/tipo-spedizione.model';
import { StatoOrdine } from 'app/entities/enumerations/stato-ordine.model';

export interface IOrdine {
  id: number;
  numeroOrdine?: string | null;
  clienteId?: string | null;
  nomeCliente?: string | null;
  cognomeCliente?: string | null;
  email?: string | null;
  indirizzo?: string | null;
  citta?: string | null;
  provincia?: string | null;
  cap?: string | null;
  statoPaese?: string | null;
  tipoSpedizione?: keyof typeof TipoSpedizione | null;
  costoSpedizione?: number | null;
  totaleImponibile?: number | null;
  totaleIva?: number | null;
  totaleFinal?: number | null;
  statoOrdine?: keyof typeof StatoOrdine | null;
  dataCreazione?: dayjs.Dayjs | null;
}

export type NewOrdine = Omit<IOrdine, 'id'> & { id: null };
