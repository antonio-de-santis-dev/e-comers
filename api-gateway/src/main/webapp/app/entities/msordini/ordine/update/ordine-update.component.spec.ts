import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { OrdineService } from '../service/ordine.service';
import { IOrdine } from '../ordine.model';
import { OrdineFormService } from './ordine-form.service';

import { OrdineUpdateComponent } from './ordine-update.component';

describe('Ordine Management Update Component', () => {
  let comp: OrdineUpdateComponent;
  let fixture: ComponentFixture<OrdineUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let ordineFormService: OrdineFormService;
  let ordineService: OrdineService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [OrdineUpdateComponent],
      providers: [
        provideHttpClient(),
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(OrdineUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(OrdineUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    ordineFormService = TestBed.inject(OrdineFormService);
    ordineService = TestBed.inject(OrdineService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should update editForm', () => {
      const ordine: IOrdine = { id: 21081 };

      activatedRoute.data = of({ ordine });
      comp.ngOnInit();

      expect(comp.ordine).toEqual(ordine);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IOrdine>>();
      const ordine = { id: 15761 };
      jest.spyOn(ordineFormService, 'getOrdine').mockReturnValue(ordine);
      jest.spyOn(ordineService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ ordine });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: ordine }));
      saveSubject.complete();

      // THEN
      expect(ordineFormService.getOrdine).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(ordineService.update).toHaveBeenCalledWith(expect.objectContaining(ordine));
      expect(comp.isSaving).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IOrdine>>();
      const ordine = { id: 15761 };
      jest.spyOn(ordineFormService, 'getOrdine').mockReturnValue({ id: null });
      jest.spyOn(ordineService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ ordine: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: ordine }));
      saveSubject.complete();

      // THEN
      expect(ordineFormService.getOrdine).toHaveBeenCalled();
      expect(ordineService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IOrdine>>();
      const ordine = { id: 15761 };
      jest.spyOn(ordineService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ ordine });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(ordineService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
