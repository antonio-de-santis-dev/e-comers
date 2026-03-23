import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IPagamento } from '../pagamento.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../pagamento.test-samples';

import { PagamentoService, RestPagamento } from './pagamento.service';

const requireRestSample: RestPagamento = {
  ...sampleWithRequiredData,
  dataOperazione: sampleWithRequiredData.dataOperazione?.toJSON(),
};

describe('Pagamento Service', () => {
  let service: PagamentoService;
  let httpMock: HttpTestingController;
  let expectedResult: IPagamento | IPagamento[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(PagamentoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Pagamento', () => {
      const pagamento = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(pagamento).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Pagamento', () => {
      const pagamento = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(pagamento).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Pagamento', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Pagamento', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Pagamento', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addPagamentoToCollectionIfMissing', () => {
      it('should add a Pagamento to an empty array', () => {
        const pagamento: IPagamento = sampleWithRequiredData;
        expectedResult = service.addPagamentoToCollectionIfMissing([], pagamento);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(pagamento);
      });

      it('should not add a Pagamento to an array that contains it', () => {
        const pagamento: IPagamento = sampleWithRequiredData;
        const pagamentoCollection: IPagamento[] = [
          {
            ...pagamento,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addPagamentoToCollectionIfMissing(pagamentoCollection, pagamento);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Pagamento to an array that doesn't contain it", () => {
        const pagamento: IPagamento = sampleWithRequiredData;
        const pagamentoCollection: IPagamento[] = [sampleWithPartialData];
        expectedResult = service.addPagamentoToCollectionIfMissing(pagamentoCollection, pagamento);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(pagamento);
      });

      it('should add only unique Pagamento to an array', () => {
        const pagamentoArray: IPagamento[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const pagamentoCollection: IPagamento[] = [sampleWithRequiredData];
        expectedResult = service.addPagamentoToCollectionIfMissing(pagamentoCollection, ...pagamentoArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const pagamento: IPagamento = sampleWithRequiredData;
        const pagamento2: IPagamento = sampleWithPartialData;
        expectedResult = service.addPagamentoToCollectionIfMissing([], pagamento, pagamento2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(pagamento);
        expect(expectedResult).toContain(pagamento2);
      });

      it('should accept null and undefined values', () => {
        const pagamento: IPagamento = sampleWithRequiredData;
        expectedResult = service.addPagamentoToCollectionIfMissing([], null, pagamento, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(pagamento);
      });

      it('should return initial array if no Pagamento is added', () => {
        const pagamentoCollection: IPagamento[] = [sampleWithRequiredData];
        expectedResult = service.addPagamentoToCollectionIfMissing(pagamentoCollection, undefined, null);
        expect(expectedResult).toEqual(pagamentoCollection);
      });
    });

    describe('comparePagamento', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.comparePagamento(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 5510 };
        const entity2 = null;

        const compareResult1 = service.comparePagamento(entity1, entity2);
        const compareResult2 = service.comparePagamento(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 5510 };
        const entity2 = { id: 11344 };

        const compareResult1 = service.comparePagamento(entity1, entity2);
        const compareResult2 = service.comparePagamento(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 5510 };
        const entity2 = { id: 5510 };

        const compareResult1 = service.comparePagamento(entity1, entity2);
        const compareResult2 = service.comparePagamento(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
