import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../notifica.test-samples';

import { NotificaFormService } from './notifica-form.service';

describe('Notifica Form Service', () => {
  let service: NotificaFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificaFormService);
  });

  describe('Service methods', () => {
    describe('createNotificaFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createNotificaFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            tipo: expect.any(Object),
            messaggio: expect.any(Object),
            destinatario: expect.any(Object),
            letta: expect.any(Object),
            dataNotifica: expect.any(Object),
            riferimentoId: expect.any(Object),
          }),
        );
      });

      it('passing INotifica should create a new form with FormGroup', () => {
        const formGroup = service.createNotificaFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            tipo: expect.any(Object),
            messaggio: expect.any(Object),
            destinatario: expect.any(Object),
            letta: expect.any(Object),
            dataNotifica: expect.any(Object),
            riferimentoId: expect.any(Object),
          }),
        );
      });
    });

    describe('getNotifica', () => {
      it('should return NewNotifica for default Notifica initial value', () => {
        const formGroup = service.createNotificaFormGroup(sampleWithNewData);

        const notifica = service.getNotifica(formGroup) as any;

        expect(notifica).toMatchObject(sampleWithNewData);
      });

      it('should return NewNotifica for empty Notifica initial value', () => {
        const formGroup = service.createNotificaFormGroup();

        const notifica = service.getNotifica(formGroup) as any;

        expect(notifica).toMatchObject({});
      });

      it('should return INotifica', () => {
        const formGroup = service.createNotificaFormGroup(sampleWithRequiredData);

        const notifica = service.getNotifica(formGroup) as any;

        expect(notifica).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing INotifica should not enable id FormControl', () => {
        const formGroup = service.createNotificaFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewNotifica should disable id FormControl', () => {
        const formGroup = service.createNotificaFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
