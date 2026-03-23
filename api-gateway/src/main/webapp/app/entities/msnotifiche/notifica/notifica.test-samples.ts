import dayjs from 'dayjs/esm';

import { INotifica, NewNotifica } from './notifica.model';

export const sampleWithRequiredData: INotifica = {
  id: 2666,
  tipo: 'clinking',
  messaggio: '../fake-data/blob/hipster.txt',
  destinatario: 'er hence whereas',
};

export const sampleWithPartialData: INotifica = {
  id: 29188,
  tipo: 'gadzooks yuck',
  messaggio: '../fake-data/blob/hipster.txt',
  destinatario: 'sympathetically astride',
  letta: false,
};

export const sampleWithFullData: INotifica = {
  id: 6755,
  tipo: 'hmph oof',
  messaggio: '../fake-data/blob/hipster.txt',
  destinatario: 'coop motionless',
  letta: false,
  dataNotifica: dayjs('2026-03-20T08:54'),
  riferimentoId: 'fundraising beside',
};

export const sampleWithNewData: NewNotifica = {
  tipo: 'supposing once',
  messaggio: '../fake-data/blob/hipster.txt',
  destinatario: 'seldom pulp mmm',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
