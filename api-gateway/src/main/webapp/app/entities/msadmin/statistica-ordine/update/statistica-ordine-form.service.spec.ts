import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../statistica-ordine.test-samples';

import { StatisticaOrdineFormService } from './statistica-ordine-form.service';

describe('StatisticaOrdine Form Service', () => {
  let service: StatisticaOrdineFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StatisticaOrdineFormService);
  });

  describe('Service methods', () => {
    describe('createStatisticaOrdineFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createStatisticaOrdineFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            ordineId: expect.any(Object),
            importoTotale: expect.any(Object),
            statoOrdine: expect.any(Object),
            microservizio: expect.any(Object),
            dataRegistrazione: expect.any(Object),
            note: expect.any(Object),
          }),
        );
      });

      it('passing IStatisticaOrdine should create a new form with FormGroup', () => {
        const formGroup = service.createStatisticaOrdineFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            ordineId: expect.any(Object),
            importoTotale: expect.any(Object),
            statoOrdine: expect.any(Object),
            microservizio: expect.any(Object),
            dataRegistrazione: expect.any(Object),
            note: expect.any(Object),
          }),
        );
      });
    });

    describe('getStatisticaOrdine', () => {
      it('should return NewStatisticaOrdine for default StatisticaOrdine initial value', () => {
        const formGroup = service.createStatisticaOrdineFormGroup(sampleWithNewData);

        const statisticaOrdine = service.getStatisticaOrdine(formGroup) as any;

        expect(statisticaOrdine).toMatchObject(sampleWithNewData);
      });

      it('should return NewStatisticaOrdine for empty StatisticaOrdine initial value', () => {
        const formGroup = service.createStatisticaOrdineFormGroup();

        const statisticaOrdine = service.getStatisticaOrdine(formGroup) as any;

        expect(statisticaOrdine).toMatchObject({});
      });

      it('should return IStatisticaOrdine', () => {
        const formGroup = service.createStatisticaOrdineFormGroup(sampleWithRequiredData);

        const statisticaOrdine = service.getStatisticaOrdine(formGroup) as any;

        expect(statisticaOrdine).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IStatisticaOrdine should not enable id FormControl', () => {
        const formGroup = service.createStatisticaOrdineFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewStatisticaOrdine should disable id FormControl', () => {
        const formGroup = service.createStatisticaOrdineFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
