import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IRigaOrdine } from '../riga-ordine.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../riga-ordine.test-samples';

import { RigaOrdineService } from './riga-ordine.service';

const requireRestSample: IRigaOrdine = {
  ...sampleWithRequiredData,
};

describe('RigaOrdine Service', () => {
  let service: RigaOrdineService;
  let httpMock: HttpTestingController;
  let expectedResult: IRigaOrdine | IRigaOrdine[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(RigaOrdineService);
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

    it('should create a RigaOrdine', () => {
      const rigaOrdine = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(rigaOrdine).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a RigaOrdine', () => {
      const rigaOrdine = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(rigaOrdine).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a RigaOrdine', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of RigaOrdine', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a RigaOrdine', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addRigaOrdineToCollectionIfMissing', () => {
      it('should add a RigaOrdine to an empty array', () => {
        const rigaOrdine: IRigaOrdine = sampleWithRequiredData;
        expectedResult = service.addRigaOrdineToCollectionIfMissing([], rigaOrdine);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(rigaOrdine);
      });

      it('should not add a RigaOrdine to an array that contains it', () => {
        const rigaOrdine: IRigaOrdine = sampleWithRequiredData;
        const rigaOrdineCollection: IRigaOrdine[] = [
          {
            ...rigaOrdine,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addRigaOrdineToCollectionIfMissing(rigaOrdineCollection, rigaOrdine);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a RigaOrdine to an array that doesn't contain it", () => {
        const rigaOrdine: IRigaOrdine = sampleWithRequiredData;
        const rigaOrdineCollection: IRigaOrdine[] = [sampleWithPartialData];
        expectedResult = service.addRigaOrdineToCollectionIfMissing(rigaOrdineCollection, rigaOrdine);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(rigaOrdine);
      });

      it('should add only unique RigaOrdine to an array', () => {
        const rigaOrdineArray: IRigaOrdine[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const rigaOrdineCollection: IRigaOrdine[] = [sampleWithRequiredData];
        expectedResult = service.addRigaOrdineToCollectionIfMissing(rigaOrdineCollection, ...rigaOrdineArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const rigaOrdine: IRigaOrdine = sampleWithRequiredData;
        const rigaOrdine2: IRigaOrdine = sampleWithPartialData;
        expectedResult = service.addRigaOrdineToCollectionIfMissing([], rigaOrdine, rigaOrdine2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(rigaOrdine);
        expect(expectedResult).toContain(rigaOrdine2);
      });

      it('should accept null and undefined values', () => {
        const rigaOrdine: IRigaOrdine = sampleWithRequiredData;
        expectedResult = service.addRigaOrdineToCollectionIfMissing([], null, rigaOrdine, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(rigaOrdine);
      });

      it('should return initial array if no RigaOrdine is added', () => {
        const rigaOrdineCollection: IRigaOrdine[] = [sampleWithRequiredData];
        expectedResult = service.addRigaOrdineToCollectionIfMissing(rigaOrdineCollection, undefined, null);
        expect(expectedResult).toEqual(rigaOrdineCollection);
      });
    });

    describe('compareRigaOrdine', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareRigaOrdine(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 32109 };
        const entity2 = null;

        const compareResult1 = service.compareRigaOrdine(entity1, entity2);
        const compareResult2 = service.compareRigaOrdine(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 32109 };
        const entity2 = { id: 8107 };

        const compareResult1 = service.compareRigaOrdine(entity1, entity2);
        const compareResult2 = service.compareRigaOrdine(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 32109 };
        const entity2 = { id: 32109 };

        const compareResult1 = service.compareRigaOrdine(entity1, entity2);
        const compareResult2 = service.compareRigaOrdine(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
