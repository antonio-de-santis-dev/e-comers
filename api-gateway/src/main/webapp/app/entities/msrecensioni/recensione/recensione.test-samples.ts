import dayjs from 'dayjs/esm';

import { IRecensione, NewRecensione } from './recensione.model';

export const sampleWithRequiredData: IRecensione = {
  id: 2378,
  prodottoId: 'broadly',
  nomeCliente: 'preside sadly sans',
  descrizione: '../fake-data/blob/hipster.txt',
  votoSingolo: 3,
};

export const sampleWithPartialData: IRecensione = {
  id: 6463,
  prodottoId: 'enfold sediment powerless',
  nomeCliente: 'standard thorny',
  descrizione: '../fake-data/blob/hipster.txt',
  votoSingolo: 2,
};

export const sampleWithFullData: IRecensione = {
  id: 23582,
  prodottoId: 'without seemingly',
  ordineId: 'verify',
  nomeCliente: 'foretell near',
  descrizione: '../fake-data/blob/hipster.txt',
  votoSingolo: 4,
  approvata: true,
  dataRecensione: dayjs('2026-03-20T06:22'),
};

export const sampleWithNewData: NewRecensione = {
  prodottoId: 'consequently worriedly eventually',
  nomeCliente: 'loyalty than elegantly',
  descrizione: '../fake-data/blob/hipster.txt',
  votoSingolo: 3,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
