import { ICategoria, NewCategoria } from './categoria.model';

export const sampleWithRequiredData: ICategoria = {
  id: 16672,
  nome: 'clavicle',
};

export const sampleWithPartialData: ICategoria = {
  id: 25718,
  nome: 'tough ouch while',
};

export const sampleWithFullData: ICategoria = {
  id: 12751,
  nome: 'what unlucky yowza',
  descrizione: 'respray',
};

export const sampleWithNewData: NewCategoria = {
  nome: 'unbalance delightfully like',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
