import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { IOrdine } from 'app/entities/msordini/ordine/ordine.model';
import { OrdineService } from 'app/entities/msordini/ordine/service/ordine.service';
import { RigaOrdineService } from '../service/riga-ordine.service';
import { IRigaOrdine } from '../riga-ordine.model';
import { RigaOrdineFormService } from './riga-ordine-form.service';

import { RigaOrdineUpdateComponent } from './riga-ordine-update.component';

describe('RigaOrdine Management Update Component', () => {
  let comp: RigaOrdineUpdateComponent;
  let fixture: ComponentFixture<RigaOrdineUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let rigaOrdineFormService: RigaOrdineFormService;
  let rigaOrdineService: RigaOrdineService;
  let ordineService: OrdineService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RigaOrdineUpdateComponent],
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
      .overrideTemplate(RigaOrdineUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(RigaOrdineUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    rigaOrdineFormService = TestBed.inject(RigaOrdineFormService);
    rigaOrdineService = TestBed.inject(RigaOrdineService);
    ordineService = TestBed.inject(OrdineService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should call Ordine query and add missing value', () => {
      const rigaOrdine: IRigaOrdine = { id: 8107 };
      const ordine: IOrdine = { id: 15761 };
      rigaOrdine.ordine = ordine;

      const ordineCollection: IOrdine[] = [{ id: 15761 }];
      jest.spyOn(ordineService, 'query').mockReturnValue(of(new HttpResponse({ body: ordineCollection })));
      const additionalOrdines = [ordine];
      const expectedCollection: IOrdine[] = [...additionalOrdines, ...ordineCollection];
      jest.spyOn(ordineService, 'addOrdineToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ rigaOrdine });
      comp.ngOnInit();

      expect(ordineService.query).toHaveBeenCalled();
      expect(ordineService.addOrdineToCollectionIfMissing).toHaveBeenCalledWith(
        ordineCollection,
        ...additionalOrdines.map(expect.objectContaining),
      );
      expect(comp.ordinesSharedCollection).toEqual(expectedCollection);
    });

    it('should update editForm', () => {
      const rigaOrdine: IRigaOrdine = { id: 8107 };
      const ordine: IOrdine = { id: 15761 };
      rigaOrdine.ordine = ordine;

      activatedRoute.data = of({ rigaOrdine });
      comp.ngOnInit();

      expect(comp.ordinesSharedCollection).toContainEqual(ordine);
      expect(comp.rigaOrdine).toEqual(rigaOrdine);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IRigaOrdine>>();
      const rigaOrdine = { id: 32109 };
      jest.spyOn(rigaOrdineFormService, 'getRigaOrdine').mockReturnValue(rigaOrdine);
      jest.spyOn(rigaOrdineService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ rigaOrdine });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: rigaOrdine }));
      saveSubject.complete();

      // THEN
      expect(rigaOrdineFormService.getRigaOrdine).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(rigaOrdineService.update).toHaveBeenCalledWith(expect.objectContaining(rigaOrdine));
      expect(comp.isSaving).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IRigaOrdine>>();
      const rigaOrdine = { id: 32109 };
      jest.spyOn(rigaOrdineFormService, 'getRigaOrdine').mockReturnValue({ id: null });
      jest.spyOn(rigaOrdineService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ rigaOrdine: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: rigaOrdine }));
      saveSubject.complete();

      // THEN
      expect(rigaOrdineFormService.getRigaOrdine).toHaveBeenCalled();
      expect(rigaOrdineService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IRigaOrdine>>();
      const rigaOrdine = { id: 32109 };
      jest.spyOn(rigaOrdineService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ rigaOrdine });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(rigaOrdineService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareOrdine', () => {
      it('should forward to ordineService', () => {
        const entity = { id: 15761 };
        const entity2 = { id: 21081 };
        jest.spyOn(ordineService, 'compareOrdine');
        comp.compareOrdine(entity, entity2);
        expect(ordineService.compareOrdine).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
