import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { NotificaService } from '../service/notifica.service';
import { INotifica } from '../notifica.model';
import { NotificaFormService } from './notifica-form.service';

import { NotificaUpdateComponent } from './notifica-update.component';

describe('Notifica Management Update Component', () => {
  let comp: NotificaUpdateComponent;
  let fixture: ComponentFixture<NotificaUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let notificaFormService: NotificaFormService;
  let notificaService: NotificaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NotificaUpdateComponent],
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
      .overrideTemplate(NotificaUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(NotificaUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    notificaFormService = TestBed.inject(NotificaFormService);
    notificaService = TestBed.inject(NotificaService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should update editForm', () => {
      const notifica: INotifica = { id: 10814 };

      activatedRoute.data = of({ notifica });
      comp.ngOnInit();

      expect(comp.notifica).toEqual(notifica);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<INotifica>>();
      const notifica = { id: 26327 };
      jest.spyOn(notificaFormService, 'getNotifica').mockReturnValue(notifica);
      jest.spyOn(notificaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ notifica });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: notifica }));
      saveSubject.complete();

      // THEN
      expect(notificaFormService.getNotifica).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(notificaService.update).toHaveBeenCalledWith(expect.objectContaining(notifica));
      expect(comp.isSaving).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<INotifica>>();
      const notifica = { id: 26327 };
      jest.spyOn(notificaFormService, 'getNotifica').mockReturnValue({ id: null });
      jest.spyOn(notificaService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ notifica: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: notifica }));
      saveSubject.complete();

      // THEN
      expect(notificaFormService.getNotifica).toHaveBeenCalled();
      expect(notificaService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<INotifica>>();
      const notifica = { id: 26327 };
      jest.spyOn(notificaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ notifica });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(notificaService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
