import dayjs from 'dayjs/esm';

import { IRecensione, NewRecensione } from './recensione.model';

export const sampleWithRequiredData: IRecensione = {
  id: '507f1f77bcf86cd799439011',
  prodottoId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  nomeCliente: 'Mario Rossi',
  descrizione: 'Prodotto ottimo, consegna veloce.',
  votoSingolo: 5,
};

export const sampleWithPartialData: IRecensione = {
  id: '507f1f77bcf86cd799439012',
  prodottoId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567891',
  nomeCliente: 'Anna Verdi',
  descrizione: 'Buon prodotto, soddisfatta.',
  votoSingolo: 4,
};

export const sampleWithFullData: IRecensione = {
  id: '507f1f77bcf86cd799439013',
  prodottoId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567892',
  ordineId: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
  nomeCliente: 'Luigi Bianchi',
  descrizione: 'Ottimo, lo consiglio vivamente!',
  votoSingolo: 5,
  approvata: true,
  dataRecensione: dayjs('2026-03-20T06:22'),
};

export const sampleWithNewData: NewRecensione = {
  prodottoId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567893',
  nomeCliente: 'Giulia Neri',
  descrizione: "Soddisfatta dell'acquisto.",
  votoSingolo: 4,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
