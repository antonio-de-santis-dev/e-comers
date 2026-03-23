import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IOrdine } from '../ordine.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../ordine.test-samples';

import { OrdineService, RestOrdine } from './ordine.service';

const requireRestSample: RestOrdine = {
  ...sampleWithRequiredData,
  dataCreazione: sampleWithRequiredData.dataCreazione?.toJSON(),
};

describe('Ordine Service', () => {
  let service: OrdineService;
  let httpMock: HttpTestingController;
  let expectedResult: IOrdine | IOrdine[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(OrdineService);
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

    it('should create a Ordine', () => {
      const ordine = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(ordine).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Ordine', () => {
      const ordine = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(ordine).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Ordine', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Ordine', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Ordine', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addOrdineToCollectionIfMissing', () => {
      it('should add a Ordine to an empty array', () => {
        const ordine: IOrdine = sampleWithRequiredData;
        expectedResult = service.addOrdineToCollectionIfMissing([], ordine);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(ordine);
      });

      it('should not add a Ordine to an array that contains it', () => {
        const ordine: IOrdine = sampleWithRequiredData;
        const ordineCollection: IOrdine[] = [
          {
            ...ordine,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addOrdineToCollectionIfMissing(ordineCollection, ordine);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Ordine to an array that doesn't contain it", () => {
        const ordine: IOrdine = sampleWithRequiredData;
        const ordineCollection: IOrdine[] = [sampleWithPartialData];
        expectedResult = service.addOrdineToCollectionIfMissing(ordineCollection, ordine);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(ordine);
      });

      it('should add only unique Ordine to an array', () => {
        const ordineArray: IOrdine[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const ordineCollection: IOrdine[] = [sampleWithRequiredData];
        expectedResult = service.addOrdineToCollectionIfMissing(ordineCollection, ...ordineArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const ordine: IOrdine = sampleWithRequiredData;
        const ordine2: IOrdine = sampleWithPartialData;
        expectedResult = service.addOrdineToCollectionIfMissing([], ordine, ordine2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(ordine);
        expect(expectedResult).toContain(ordine2);
      });

      it('should accept null and undefined values', () => {
        const ordine: IOrdine = sampleWithRequiredData;
        expectedResult = service.addOrdineToCollectionIfMissing([], null, ordine, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(ordine);
      });

      it('should return initial array if no Ordine is added', () => {
        const ordineCollection: IOrdine[] = [sampleWithRequiredData];
        expectedResult = service.addOrdineToCollectionIfMissing(ordineCollection, undefined, null);
        expect(expectedResult).toEqual(ordineCollection);
      });
    });

    describe('compareOrdine', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareOrdine(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 15761 };
        const entity2 = null;

        const compareResult1 = service.compareOrdine(entity1, entity2);
        const compareResult2 = service.compareOrdine(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 15761 };
        const entity2 = { id: 21081 };

        const compareResult1 = service.compareOrdine(entity1, entity2);
        const compareResult2 = service.compareOrdine(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 15761 };
        const entity2 = { id: 15761 };

        const compareResult1 = service.compareOrdine(entity1, entity2);
        const compareResult2 = service.compareOrdine(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
