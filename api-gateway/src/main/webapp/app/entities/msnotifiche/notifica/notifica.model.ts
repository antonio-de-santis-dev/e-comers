import dayjs from 'dayjs/esm';

export interface INotifica {
  id: number;
  tipo?: string | null;
  messaggio?: string | null;
  destinatario?: string | null;
  letta?: boolean | null;
  dataNotifica?: dayjs.Dayjs | null;
  riferimentoId?: string | null;
}

export type NewNotifica = Omit<INotifica, 'id'> & { id: null };
