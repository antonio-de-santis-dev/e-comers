import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { StatisticaOrdineService } from '../service/statistica-ordine.service';
import { IStatisticaOrdine } from '../statistica-ordine.model';
import { StatisticaOrdineFormService } from './statistica-ordine-form.service';

import { StatisticaOrdineUpdateComponent } from './statistica-ordine-update.component';

describe('StatisticaOrdine Management Update Component', () => {
  let comp: StatisticaOrdineUpdateComponent;
  let fixture: ComponentFixture<StatisticaOrdineUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let statisticaOrdineFormService: StatisticaOrdineFormService;
  let statisticaOrdineService: StatisticaOrdineService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StatisticaOrdineUpdateComponent],
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
      .overrideTemplate(StatisticaOrdineUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(StatisticaOrdineUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    statisticaOrdineFormService = TestBed.inject(StatisticaOrdineFormService);
    statisticaOrdineService = TestBed.inject(StatisticaOrdineService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should update editForm', () => {
      const statisticaOrdine: IStatisticaOrdine = { id: 5087 };

      activatedRoute.data = of({ statisticaOrdine });
      comp.ngOnInit();

      expect(comp.statisticaOrdine).toEqual(statisticaOrdine);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IStatisticaOrdine>>();
      const statisticaOrdine = { id: 29061 };
      jest.spyOn(statisticaOrdineFormService, 'getStatisticaOrdine').mockReturnValue(statisticaOrdine);
      jest.spyOn(statisticaOrdineService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ statisticaOrdine });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: statisticaOrdine }));
      saveSubject.complete();

      // THEN
      expect(statisticaOrdineFormService.getStatisticaOrdine).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(statisticaOrdineService.update).toHaveBeenCalledWith(expect.objectContaining(statisticaOrdine));
      expect(comp.isSaving).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IStatisticaOrdine>>();
      const statisticaOrdine = { id: 29061 };
      jest.spyOn(statisticaOrdineFormService, 'getStatisticaOrdine').mockReturnValue({ id: null });
      jest.spyOn(statisticaOrdineService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ statisticaOrdine: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: statisticaOrdine }));
      saveSubject.complete();

      // THEN
      expect(statisticaOrdineFormService.getStatisticaOrdine).toHaveBeenCalled();
      expect(statisticaOrdineService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IStatisticaOrdine>>();
      const statisticaOrdine = { id: 29061 };
      jest.spyOn(statisticaOrdineService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ statisticaOrdine });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(statisticaOrdineService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
