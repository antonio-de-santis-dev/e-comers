import { IProdotto, NewProdotto } from './prodotto.model';

export const sampleWithRequiredData: IProdotto = {
  id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  nome: 'Prodotto Esempio',
  prezzo: 22.97,
};

export const sampleWithPartialData: IProdotto = {
  id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
  nome: 'Prodotto Parziale',
  descrizione: 'Descrizione prodotto di esempio.',
  prezzo: 56.29,
  inEvidenza: true,
};

export const sampleWithFullData: IProdotto = {
  id: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
  nome: 'Prodotto Completo',
  descrizione: 'Descrizione completa del prodotto.',
  prezzo: 19.73,
  quantitaDisponibile: 100,
  inEvidenza: true,
  immagineUrl: 'https://example.com/img.jpg',
  votoTotale: 4.5,
};

export const sampleWithNewData: NewProdotto = {
  nome: 'Nuovo Prodotto',
  prezzo: 10.99,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
