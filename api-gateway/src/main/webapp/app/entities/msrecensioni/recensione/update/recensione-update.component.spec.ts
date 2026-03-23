import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { RecensioneService } from '../service/recensione.service';
import { IRecensione } from '../recensione.model';
import { RecensioneFormService } from './recensione-form.service';

import { RecensioneUpdateComponent } from './recensione-update.component';

describe('Recensione Management Update Component', () => {
  let comp: RecensioneUpdateComponent;
  let fixture: ComponentFixture<RecensioneUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let recensioneFormService: RecensioneFormService;
  let recensioneService: RecensioneService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RecensioneUpdateComponent],
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
      .overrideTemplate(RecensioneUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(RecensioneUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    recensioneFormService = TestBed.inject(RecensioneFormService);
    recensioneService = TestBed.inject(RecensioneService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should update editForm', () => {
      const recensione: IRecensione = { id: 27588 };

      activatedRoute.data = of({ recensione });
      comp.ngOnInit();

      expect(comp.recensione).toEqual(recensione);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IRecensione>>();
      const recensione = { id: 4680 };
      jest.spyOn(recensioneFormService, 'getRecensione').mockReturnValue(recensione);
      jest.spyOn(recensioneService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ recensione });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: recensione }));
      saveSubject.complete();

      // THEN
      expect(recensioneFormService.getRecensione).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(recensioneService.update).toHaveBeenCalledWith(expect.objectContaining(recensione));
      expect(comp.isSaving).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IRecensione>>();
      const recensione = { id: 4680 };
      jest.spyOn(recensioneFormService, 'getRecensione').mockReturnValue({ id: null });
      jest.spyOn(recensioneService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ recensione: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: recensione }));
      saveSubject.complete();

      // THEN
      expect(recensioneFormService.getRecensione).toHaveBeenCalled();
      expect(recensioneService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IRecensione>>();
      const recensione = { id: 4680 };
      jest.spyOn(recensioneService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ recensione });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(recensioneService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
