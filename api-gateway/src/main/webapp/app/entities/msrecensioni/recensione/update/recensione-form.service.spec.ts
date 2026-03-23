import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../recensione.test-samples';

import { RecensioneFormService } from './recensione-form.service';

describe('Recensione Form Service', () => {
  let service: RecensioneFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecensioneFormService);
  });

  describe('Service methods', () => {
    describe('createRecensioneFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createRecensioneFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            prodottoId: expect.any(Object),
            ordineId: expect.any(Object),
            nomeCliente: expect.any(Object),
            descrizione: expect.any(Object),
            votoSingolo: expect.any(Object),
            approvata: expect.any(Object),
            dataRecensione: expect.any(Object),
          }),
        );
      });

      it('passing IRecensione should create a new form with FormGroup', () => {
        const formGroup = service.createRecensioneFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            prodottoId: expect.any(Object),
            ordineId: expect.any(Object),
            nomeCliente: expect.any(Object),
            descrizione: expect.any(Object),
            votoSingolo: expect.any(Object),
            approvata: expect.any(Object),
            dataRecensione: expect.any(Object),
          }),
        );
      });
    });

    describe('getRecensione', () => {
      it('should return NewRecensione for default Recensione initial value', () => {
        const formGroup = service.createRecensioneFormGroup(sampleWithNewData);

        const recensione = service.getRecensione(formGroup) as any;

        expect(recensione).toMatchObject(sampleWithNewData);
      });

      it('should return NewRecensione for empty Recensione initial value', () => {
        const formGroup = service.createRecensioneFormGroup();

        const recensione = service.getRecensione(formGroup) as any;

        expect(recensione).toMatchObject({});
      });

      it('should return IRecensione', () => {
        const formGroup = service.createRecensioneFormGroup(sampleWithRequiredData);

        const recensione = service.getRecensione(formGroup) as any;

        expect(recensione).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IRecensione should not enable id FormControl', () => {
        const formGroup = service.createRecensioneFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewRecensione should disable id FormControl', () => {
        const formGroup = service.createRecensioneFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
