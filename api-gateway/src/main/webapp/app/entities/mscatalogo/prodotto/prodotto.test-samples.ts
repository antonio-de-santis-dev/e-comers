import { IProdotto, NewProdotto } from './prodotto.model';

export const sampleWithRequiredData: IProdotto = {
  id: 31021,
  nome: 'guilty beyond',
  prezzo: 22297,
};

export const sampleWithPartialData: IProdotto = {
  id: 24161,
  nome: 'creative at',
  descrizione: '../fake-data/blob/hipster.txt',
  prezzo: 5624.29,
  inEvidenza: true,
};

export const sampleWithFullData: IProdotto = {
  id: 29949,
  nome: 'sticker',
  descrizione: '../fake-data/blob/hipster.txt',
  prezzo: 1973.36,
  quantitaDisponibile: 29111,
  inEvidenza: true,
  immagineUrl: 'uh-huh sandbar times',
  votoTotale: 9472.91,
};

export const sampleWithNewData: NewProdotto = {
  nome: 'pish offset near',
  prezzo: 10680.87,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
