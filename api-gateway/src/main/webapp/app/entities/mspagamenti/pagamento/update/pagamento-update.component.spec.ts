import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { PagamentoService } from '../service/pagamento.service';
import { IPagamento } from '../pagamento.model';
import { PagamentoFormService } from './pagamento-form.service';

import { PagamentoUpdateComponent } from './pagamento-update.component';

describe('Pagamento Management Update Component', () => {
  let comp: PagamentoUpdateComponent;
  let fixture: ComponentFixture<PagamentoUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let pagamentoFormService: PagamentoFormService;
  let pagamentoService: PagamentoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PagamentoUpdateComponent],
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
      .overrideTemplate(PagamentoUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PagamentoUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    pagamentoFormService = TestBed.inject(PagamentoFormService);
    pagamentoService = TestBed.inject(PagamentoService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should update editForm', () => {
      const pagamento: IPagamento = { id: 11344 };

      activatedRoute.data = of({ pagamento });
      comp.ngOnInit();

      expect(comp.pagamento).toEqual(pagamento);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPagamento>>();
      const pagamento = { id: 5510 };
      jest.spyOn(pagamentoFormService, 'getPagamento').mockReturnValue(pagamento);
      jest.spyOn(pagamentoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ pagamento });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: pagamento }));
      saveSubject.complete();

      // THEN
      expect(pagamentoFormService.getPagamento).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(pagamentoService.update).toHaveBeenCalledWith(expect.objectContaining(pagamento));
      expect(comp.isSaving).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPagamento>>();
      const pagamento = { id: 5510 };
      jest.spyOn(pagamentoFormService, 'getPagamento').mockReturnValue({ id: null });
      jest.spyOn(pagamentoService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ pagamento: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: pagamento }));
      saveSubject.complete();

      // THEN
      expect(pagamentoFormService.getPagamento).toHaveBeenCalled();
      expect(pagamentoService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPagamento>>();
      const pagamento = { id: 5510 };
      jest.spyOn(pagamentoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ pagamento });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(pagamentoService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
