import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../riga-ordine.test-samples';

import { RigaOrdineFormService } from './riga-ordine-form.service';

describe('RigaOrdine Form Service', () => {
  let service: RigaOrdineFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RigaOrdineFormService);
  });

  describe('Service methods', () => {
    describe('createRigaOrdineFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createRigaOrdineFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            prodottoId: expect.any(Object),
            nomeProdotto: expect.any(Object),
            quantita: expect.any(Object),
            prezzoUnitario: expect.any(Object),
            totaleRiga: expect.any(Object),
            ordine: expect.any(Object),
          }),
        );
      });

      it('passing IRigaOrdine should create a new form with FormGroup', () => {
        const formGroup = service.createRigaOrdineFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            prodottoId: expect.any(Object),
            nomeProdotto: expect.any(Object),
            quantita: expect.any(Object),
            prezzoUnitario: expect.any(Object),
            totaleRiga: expect.any(Object),
            ordine: expect.any(Object),
          }),
        );
      });
    });

    describe('getRigaOrdine', () => {
      it('should return NewRigaOrdine for default RigaOrdine initial value', () => {
        const formGroup = service.createRigaOrdineFormGroup(sampleWithNewData);

        const rigaOrdine = service.getRigaOrdine(formGroup) as any;

        expect(rigaOrdine).toMatchObject(sampleWithNewData);
      });

      it('should return NewRigaOrdine for empty RigaOrdine initial value', () => {
        const formGroup = service.createRigaOrdineFormGroup();

        const rigaOrdine = service.getRigaOrdine(formGroup) as any;

        expect(rigaOrdine).toMatchObject({});
      });

      it('should return IRigaOrdine', () => {
        const formGroup = service.createRigaOrdineFormGroup(sampleWithRequiredData);

        const rigaOrdine = service.getRigaOrdine(formGroup) as any;

        expect(rigaOrdine).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IRigaOrdine should not enable id FormControl', () => {
        const formGroup = service.createRigaOrdineFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewRigaOrdine should disable id FormControl', () => {
        const formGroup = service.createRigaOrdineFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
