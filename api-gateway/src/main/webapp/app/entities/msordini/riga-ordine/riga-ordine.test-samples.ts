import { IRigaOrdine, NewRigaOrdine } from './riga-ordine.model';

export const sampleWithRequiredData: IRigaOrdine = {
  id: 232,
  prodottoId: '58f56338-f44b-4edb-a112-c4bff9927c51',
  nomeProdotto: 'outside reflate',
  quantita: 19711,
  prezzoUnitario: 23421.26,
};

export const sampleWithPartialData: IRigaOrdine = {
  id: 32129,
  prodottoId: 'fb6d6076-027e-4efa-8711-d5c379635351',
  nomeProdotto: 'unto yuck apostrophize',
  quantita: 27945,
  prezzoUnitario: 25862.88,
};

export const sampleWithFullData: IRigaOrdine = {
  id: 31783,
  prodottoId: 'ad9b109b-ed2e-4711-b805-5e511db35af3',
  nomeProdotto: 'intend travel through',
  quantita: 25264,
  prezzoUnitario: 13869.2,
  totaleRiga: 25317.82,
};

export const sampleWithNewData: NewRigaOrdine = {
  prodottoId: 'ced97177-2edd-477e-9b4d-3df2968a0b7d',
  nomeProdotto: 'economise young',
  quantita: 5892,
  prezzoUnitario: 16159.99,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
