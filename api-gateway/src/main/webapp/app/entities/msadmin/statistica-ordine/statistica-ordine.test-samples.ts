import dayjs from 'dayjs/esm';

import { IStatisticaOrdine, NewStatisticaOrdine } from './statistica-ordine.model';

export const sampleWithRequiredData: IStatisticaOrdine = {
  id: 14771,
  ordineId: '5fcb7cd3-d87e-4ba1-8889-33757775add8',
};

export const sampleWithPartialData: IStatisticaOrdine = {
  id: 16001,
  ordineId: '442d2802-a563-4bce-9874-fb032f84c6d1',
  importoTotale: 7433,
  statoOrdine: 'past oof',
  microservizio: 'overstay',
};

export const sampleWithFullData: IStatisticaOrdine = {
  id: 23364,
  ordineId: '6cefe67e-1da3-4a37-9261-e6134f2156cd',
  importoTotale: 26795.08,
  statoOrdine: 'until',
  microservizio: 'apud',
  dataRegistrazione: dayjs('2026-03-19T23:13'),
  note: 'boohoo joyfully excitedly',
};

export const sampleWithNewData: NewStatisticaOrdine = {
  ordineId: '5fd51811-1231-4384-bf9f-30251afac9d7',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
