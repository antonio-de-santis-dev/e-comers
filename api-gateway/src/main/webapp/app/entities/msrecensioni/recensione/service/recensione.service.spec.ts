import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IRecensione } from '../recensione.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../recensione.test-samples';

import { RecensioneService, RestRecensione } from './recensione.service';

const requireRestSample: RestRecensione = {
  ...sampleWithRequiredData,
  dataRecensione: sampleWithRequiredData.dataRecensione?.toJSON(),
};

describe('Recensione Service', () => {
  let service: RecensioneService;
  let httpMock: HttpTestingController;
  let expectedResult: IRecensione | IRecensione[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(RecensioneService);
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

    it('should create a Recensione', () => {
      const recensione = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(recensione).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Recensione', () => {
      const recensione = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(recensione).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Recensione', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Recensione', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Recensione', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addRecensioneToCollectionIfMissing', () => {
      it('should add a Recensione to an empty array', () => {
        const recensione: IRecensione = sampleWithRequiredData;
        expectedResult = service.addRecensioneToCollectionIfMissing([], recensione);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(recensione);
      });

      it('should not add a Recensione to an array that contains it', () => {
        const recensione: IRecensione = sampleWithRequiredData;
        const recensioneCollection: IRecensione[] = [
          {
            ...recensione,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addRecensioneToCollectionIfMissing(recensioneCollection, recensione);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Recensione to an array that doesn't contain it", () => {
        const recensione: IRecensione = sampleWithRequiredData;
        const recensioneCollection: IRecensione[] = [sampleWithPartialData];
        expectedResult = service.addRecensioneToCollectionIfMissing(recensioneCollection, recensione);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(recensione);
      });

      it('should add only unique Recensione to an array', () => {
        const recensioneArray: IRecensione[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const recensioneCollection: IRecensione[] = [sampleWithRequiredData];
        expectedResult = service.addRecensioneToCollectionIfMissing(recensioneCollection, ...recensioneArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const recensione: IRecensione = sampleWithRequiredData;
        const recensione2: IRecensione = sampleWithPartialData;
        expectedResult = service.addRecensioneToCollectionIfMissing([], recensione, recensione2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(recensione);
        expect(expectedResult).toContain(recensione2);
      });

      it('should accept null and undefined values', () => {
        const recensione: IRecensione = sampleWithRequiredData;
        expectedResult = service.addRecensioneToCollectionIfMissing([], null, recensione, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(recensione);
      });

      it('should return initial array if no Recensione is added', () => {
        const recensioneCollection: IRecensione[] = [sampleWithRequiredData];
        expectedResult = service.addRecensioneToCollectionIfMissing(recensioneCollection, undefined, null);
        expect(expectedResult).toEqual(recensioneCollection);
      });
    });

    describe('compareRecensione', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareRecensione(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 4680 };
        const entity2 = null;

        const compareResult1 = service.compareRecensione(entity1, entity2);
        const compareResult2 = service.compareRecensione(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 4680 };
        const entity2 = { id: 27588 };

        const compareResult1 = service.compareRecensione(entity1, entity2);
        const compareResult2 = service.compareRecensione(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 4680 };
        const entity2 = { id: 4680 };

        const compareResult1 = service.compareRecensione(entity1, entity2);
        const compareResult2 = service.compareRecensione(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
