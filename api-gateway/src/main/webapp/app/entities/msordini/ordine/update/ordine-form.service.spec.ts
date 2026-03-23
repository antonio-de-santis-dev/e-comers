import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../ordine.test-samples';

import { OrdineFormService } from './ordine-form.service';

describe('Ordine Form Service', () => {
  let service: OrdineFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrdineFormService);
  });

  describe('Service methods', () => {
    describe('createOrdineFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createOrdineFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            numeroOrdine: expect.any(Object),
            clienteId: expect.any(Object),
            nomeCliente: expect.any(Object),
            cognomeCliente: expect.any(Object),
            email: expect.any(Object),
            indirizzo: expect.any(Object),
            citta: expect.any(Object),
            provincia: expect.any(Object),
            cap: expect.any(Object),
            statoPaese: expect.any(Object),
            tipoSpedizione: expect.any(Object),
            costoSpedizione: expect.any(Object),
            totaleImponibile: expect.any(Object),
            totaleIva: expect.any(Object),
            totaleFinal: expect.any(Object),
            statoOrdine: expect.any(Object),
            dataCreazione: expect.any(Object),
          }),
        );
      });

      it('passing IOrdine should create a new form with FormGroup', () => {
        const formGroup = service.createOrdineFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            numeroOrdine: expect.any(Object),
            clienteId: expect.any(Object),
            nomeCliente: expect.any(Object),
            cognomeCliente: expect.any(Object),
            email: expect.any(Object),
            indirizzo: expect.any(Object),
            citta: expect.any(Object),
            provincia: expect.any(Object),
            cap: expect.any(Object),
            statoPaese: expect.any(Object),
            tipoSpedizione: expect.any(Object),
            costoSpedizione: expect.any(Object),
            totaleImponibile: expect.any(Object),
            totaleIva: expect.any(Object),
            totaleFinal: expect.any(Object),
            statoOrdine: expect.any(Object),
            dataCreazione: expect.any(Object),
          }),
        );
      });
    });

    describe('getOrdine', () => {
      it('should return NewOrdine for default Ordine initial value', () => {
        const formGroup = service.createOrdineFormGroup(sampleWithNewData);

        const ordine = service.getOrdine(formGroup) as any;

        expect(ordine).toMatchObject(sampleWithNewData);
      });

      it('should return NewOrdine for empty Ordine initial value', () => {
        const formGroup = service.createOrdineFormGroup();

        const ordine = service.getOrdine(formGroup) as any;

        expect(ordine).toMatchObject({});
      });

      it('should return IOrdine', () => {
        const formGroup = service.createOrdineFormGroup(sampleWithRequiredData);

        const ordine = service.getOrdine(formGroup) as any;

        expect(ordine).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IOrdine should not enable id FormControl', () => {
        const formGroup = service.createOrdineFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewOrdine should disable id FormControl', () => {
        const formGroup = service.createOrdineFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
