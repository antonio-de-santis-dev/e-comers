import dayjs from 'dayjs/esm';

export interface IRecensione {
  id: string;           // MongoDB usa String come id (non number)
  prodottoId?: string | null;
  ordineId?: string | null;
  nomeCliente?: string | null;
  descrizione?: string | null;
  votoSingolo?: number | null;
  approvata?: boolean | null;
  dataRecensione?: dayjs.Dayjs | null;
  immagineRecensione?: string | null;
  immagineRecensioneContentType?: string | null;
}

export type NewRecensione = Omit<IRecensione, 'id'> & { id: null };
