import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { ICategoria } from 'app/entities/mscatalogo/categoria/categoria.model';
import { CategoriaService } from 'app/entities/mscatalogo/categoria/service/categoria.service';
import { ProdottoService } from '../service/prodotto.service';
import { IProdotto } from '../prodotto.model';
import { ProdottoFormService } from './prodotto-form.service';

import { ProdottoUpdateComponent } from './prodotto-update.component';

describe('Prodotto Management Update Component', () => {
  let comp: ProdottoUpdateComponent;
  let fixture: ComponentFixture<ProdottoUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let prodottoFormService: ProdottoFormService;
  let prodottoService: ProdottoService;
  let categoriaService: CategoriaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ProdottoUpdateComponent],
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
      .overrideTemplate(ProdottoUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ProdottoUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    prodottoFormService = TestBed.inject(ProdottoFormService);
    prodottoService = TestBed.inject(ProdottoService);
    categoriaService = TestBed.inject(CategoriaService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should call Categoria query and add missing value', () => {
      const prodotto: IProdotto = { id: 29716 };
      const categoria: ICategoria = { id: 24962 };
      prodotto.categoria = categoria;

      const categoriaCollection: ICategoria[] = [{ id: 24962 }];
      jest.spyOn(categoriaService, 'query').mockReturnValue(of(new HttpResponse({ body: categoriaCollection })));
      const additionalCategorias = [categoria];
      const expectedCollection: ICategoria[] = [...additionalCategorias, ...categoriaCollection];
      jest.spyOn(categoriaService, 'addCategoriaToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ prodotto });
      comp.ngOnInit();

      expect(categoriaService.query).toHaveBeenCalled();
      expect(categoriaService.addCategoriaToCollectionIfMissing).toHaveBeenCalledWith(
        categoriaCollection,
        ...additionalCategorias.map(expect.objectContaining),
      );
      expect(comp.categoriasSharedCollection).toEqual(expectedCollection);
    });

    it('should update editForm', () => {
      const prodotto: IProdotto = { id: 29716 };
      const categoria: ICategoria = { id: 24962 };
      prodotto.categoria = categoria;

      activatedRoute.data = of({ prodotto });
      comp.ngOnInit();

      expect(comp.categoriasSharedCollection).toContainEqual(categoria);
      expect(comp.prodotto).toEqual(prodotto);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IProdotto>>();
      const prodotto = { id: 544 };
      jest.spyOn(prodottoFormService, 'getProdotto').mockReturnValue(prodotto);
      jest.spyOn(prodottoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ prodotto });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: prodotto }));
      saveSubject.complete();

      // THEN
      expect(prodottoFormService.getProdotto).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(prodottoService.update).toHaveBeenCalledWith(expect.objectContaining(prodotto));
      expect(comp.isSaving).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IProdotto>>();
      const prodotto = { id: 544 };
      jest.spyOn(prodottoFormService, 'getProdotto').mockReturnValue({ id: null });
      jest.spyOn(prodottoService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ prodotto: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: prodotto }));
      saveSubject.complete();

      // THEN
      expect(prodottoFormService.getProdotto).toHaveBeenCalled();
      expect(prodottoService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IProdotto>>();
      const prodotto = { id: 544 };
      jest.spyOn(prodottoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ prodotto });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(prodottoService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareCategoria', () => {
      it('should forward to categoriaService', () => {
        const entity = { id: 24962 };
        const entity2 = { id: 11537 };
        jest.spyOn(categoriaService, 'compareCategoria');
        comp.compareCategoria(entity, entity2);
        expect(categoriaService.compareCategoria).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
