import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IStatisticaOrdine } from '../statistica-ordine.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../statistica-ordine.test-samples';

import { RestStatisticaOrdine, StatisticaOrdineService } from './statistica-ordine.service';

const requireRestSample: RestStatisticaOrdine = {
  ...sampleWithRequiredData,
  dataRegistrazione: sampleWithRequiredData.dataRegistrazione?.toJSON(),
};

describe('StatisticaOrdine Service', () => {
  let service: StatisticaOrdineService;
  let httpMock: HttpTestingController;
  let expectedResult: IStatisticaOrdine | IStatisticaOrdine[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(StatisticaOrdineService);
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

    it('should create a StatisticaOrdine', () => {
      const statisticaOrdine = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(statisticaOrdine).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a StatisticaOrdine', () => {
      const statisticaOrdine = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(statisticaOrdine).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a StatisticaOrdine', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of StatisticaOrdine', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a StatisticaOrdine', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addStatisticaOrdineToCollectionIfMissing', () => {
      it('should add a StatisticaOrdine to an empty array', () => {
        const statisticaOrdine: IStatisticaOrdine = sampleWithRequiredData;
        expectedResult = service.addStatisticaOrdineToCollectionIfMissing([], statisticaOrdine);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(statisticaOrdine);
      });

      it('should not add a StatisticaOrdine to an array that contains it', () => {
        const statisticaOrdine: IStatisticaOrdine = sampleWithRequiredData;
        const statisticaOrdineCollection: IStatisticaOrdine[] = [
          {
            ...statisticaOrdine,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addStatisticaOrdineToCollectionIfMissing(statisticaOrdineCollection, statisticaOrdine);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a StatisticaOrdine to an array that doesn't contain it", () => {
        const statisticaOrdine: IStatisticaOrdine = sampleWithRequiredData;
        const statisticaOrdineCollection: IStatisticaOrdine[] = [sampleWithPartialData];
        expectedResult = service.addStatisticaOrdineToCollectionIfMissing(statisticaOrdineCollection, statisticaOrdine);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(statisticaOrdine);
      });

      it('should add only unique StatisticaOrdine to an array', () => {
        const statisticaOrdineArray: IStatisticaOrdine[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const statisticaOrdineCollection: IStatisticaOrdine[] = [sampleWithRequiredData];
        expectedResult = service.addStatisticaOrdineToCollectionIfMissing(statisticaOrdineCollection, ...statisticaOrdineArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const statisticaOrdine: IStatisticaOrdine = sampleWithRequiredData;
        const statisticaOrdine2: IStatisticaOrdine = sampleWithPartialData;
        expectedResult = service.addStatisticaOrdineToCollectionIfMissing([], statisticaOrdine, statisticaOrdine2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(statisticaOrdine);
        expect(expectedResult).toContain(statisticaOrdine2);
      });

      it('should accept null and undefined values', () => {
        const statisticaOrdine: IStatisticaOrdine = sampleWithRequiredData;
        expectedResult = service.addStatisticaOrdineToCollectionIfMissing([], null, statisticaOrdine, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(statisticaOrdine);
      });

      it('should return initial array if no StatisticaOrdine is added', () => {
        const statisticaOrdineCollection: IStatisticaOrdine[] = [sampleWithRequiredData];
        expectedResult = service.addStatisticaOrdineToCollectionIfMissing(statisticaOrdineCollection, undefined, null);
        expect(expectedResult).toEqual(statisticaOrdineCollection);
      });
    });

    describe('compareStatisticaOrdine', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareStatisticaOrdine(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 29061 };
        const entity2 = null;

        const compareResult1 = service.compareStatisticaOrdine(entity1, entity2);
        const compareResult2 = service.compareStatisticaOrdine(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 29061 };
        const entity2 = { id: 5087 };

        const compareResult1 = service.compareStatisticaOrdine(entity1, entity2);
        const compareResult2 = service.compareStatisticaOrdine(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 29061 };
        const entity2 = { id: 29061 };

        const compareResult1 = service.compareStatisticaOrdine(entity1, entity2);
        const compareResult2 = service.compareStatisticaOrdine(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
