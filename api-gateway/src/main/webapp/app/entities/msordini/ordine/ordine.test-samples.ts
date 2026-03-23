import dayjs from 'dayjs/esm';

import { IOrdine, NewOrdine } from './ordine.model';

export const sampleWithRequiredData: IOrdine = {
  id: 21330,
  clienteId: 'ac8d4679-0621-47b1-be67-05f55c65c031',
  nomeCliente: 'poetry',
  cognomeCliente: 'successfully brr',
  email: 'Cristaldo_DeFazio@yahoo.it',
  indirizzo: 'rue shush',
  citta: 'before cruelly',
  tipoSpedizione: 'EXPRESS',
  statoOrdine: 'IN_ELABORAZIONE',
};

export const sampleWithPartialData: IOrdine = {
  id: 25206,
  clienteId: '14032ac8-6e0e-40f3-8337-9ecbef6d55ad',
  nomeCliente: 'kissingly key superficial',
  cognomeCliente: 'dime',
  email: 'Bartolomea.Rizza95@libero.it',
  indirizzo: 'engender deliberately onto',
  citta: 'despite',
  provincia: 'ape until',
  tipoSpedizione: 'SAME_DAY',
  totaleImponibile: 27424.69,
  totaleIva: 32054.3,
  totaleFinal: 28290.31,
  statoOrdine: 'IN_SPEDIZIONE',
  dataCreazione: dayjs('2026-03-19T22:54'),
};

export const sampleWithFullData: IOrdine = {
  id: 18700,
  numeroOrdine: 'profuse aw',
  clienteId: 'b6cc6902-a66b-4e38-bfc1-e07ca8cb169c',
  nomeCliente: 'omelet',
  cognomeCliente: 'cosset',
  email: 'Marianna46@gmail.com',
  indirizzo: 'yearly',
  citta: 'overcharge minus bleakly',
  provincia: 'roasted th',
  cap: 'than until',
  statoPaese: 'noisily',
  tipoSpedizione: 'STANDARD',
  costoSpedizione: 12749.92,
  totaleImponibile: 21533.14,
  totaleIva: 29987.38,
  totaleFinal: 17298.49,
  statoOrdine: 'PAGATO',
  dataCreazione: dayjs('2026-03-20T05:31'),
};

export const sampleWithNewData: NewOrdine = {
  clienteId: '44711d5e-257d-4416-ad35-208b7c273f0d',
  nomeCliente: 'confound synergy gosh',
  cognomeCliente: 'sand overdub',
  email: 'Amatore_Gerace88@email.it',
  indirizzo: 'till depot inwardly',
  citta: 'er',
  tipoSpedizione: 'EXPRESS',
  statoOrdine: 'PAGATO',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
