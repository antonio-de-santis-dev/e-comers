import dayjs from 'dayjs/esm';

import { IPagamento, NewPagamento } from './pagamento.model';

export const sampleWithRequiredData: IPagamento = {
  id: 23307,
  ordineId: '78bc3941-b129-4f4c-b4f4-6926810eb9e8',
  importo: 28116.4,
  metodoPagamento: 'CARTA_DEBITO',
  statoPagamento: 'RIMBORSATO',
};

export const sampleWithPartialData: IPagamento = {
  id: 16440,
  ordineId: '769b8870-dfaa-498b-9f0f-22b2ea9941bc',
  importo: 25263.65,
  metodoPagamento: 'CARTA_CREDITO',
  statoPagamento: 'RIFIUTATO',
  dataOperazione: dayjs('2026-03-19T21:24'),
  transazioneId: 'yum',
  note: 'intensely impish qua',
};

export const sampleWithFullData: IPagamento = {
  id: 20690,
  ordineId: '03fc1256-5247-4791-8810-543654098929',
  importo: 22405.46,
  metodoPagamento: 'CARTA_DEBITO',
  statoPagamento: 'APPROVATO',
  dataOperazione: dayjs('2026-03-20T05:01'),
  transazioneId: 'drat gladly adventurously',
  note: 'where',
};

export const sampleWithNewData: NewPagamento = {
  ordineId: 'e2b3ddec-6111-4bce-bef7-505dbe5fea94',
  importo: 725.92,
  metodoPagamento: 'CARTA_CREDITO',
  statoPagamento: 'IN_ATTESA',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
