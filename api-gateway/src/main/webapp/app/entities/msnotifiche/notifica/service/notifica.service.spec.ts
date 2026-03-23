import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { INotifica } from '../notifica.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../notifica.test-samples';

import { NotificaService, RestNotifica } from './notifica.service';

const requireRestSample: RestNotifica = {
  ...sampleWithRequiredData,
  dataNotifica: sampleWithRequiredData.dataNotifica?.toJSON(),
};

describe('Notifica Service', () => {
  let service: NotificaService;
  let httpMock: HttpTestingController;
  let expectedResult: INotifica | INotifica[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(NotificaService);
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

    it('should create a Notifica', () => {
      const notifica = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(notifica).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Notifica', () => {
      const notifica = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(notifica).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Notifica', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Notifica', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Notifica', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addNotificaToCollectionIfMissing', () => {
      it('should add a Notifica to an empty array', () => {
        const notifica: INotifica = sampleWithRequiredData;
        expectedResult = service.addNotificaToCollectionIfMissing([], notifica);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(notifica);
      });

      it('should not add a Notifica to an array that contains it', () => {
        const notifica: INotifica = sampleWithRequiredData;
        const notificaCollection: INotifica[] = [
          {
            ...notifica,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addNotificaToCollectionIfMissing(notificaCollection, notifica);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Notifica to an array that doesn't contain it", () => {
        const notifica: INotifica = sampleWithRequiredData;
        const notificaCollection: INotifica[] = [sampleWithPartialData];
        expectedResult = service.addNotificaToCollectionIfMissing(notificaCollection, notifica);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(notifica);
      });

      it('should add only unique Notifica to an array', () => {
        const notificaArray: INotifica[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const notificaCollection: INotifica[] = [sampleWithRequiredData];
        expectedResult = service.addNotificaToCollectionIfMissing(notificaCollection, ...notificaArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const notifica: INotifica = sampleWithRequiredData;
        const notifica2: INotifica = sampleWithPartialData;
        expectedResult = service.addNotificaToCollectionIfMissing([], notifica, notifica2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(notifica);
        expect(expectedResult).toContain(notifica2);
      });

      it('should accept null and undefined values', () => {
        const notifica: INotifica = sampleWithRequiredData;
        expectedResult = service.addNotificaToCollectionIfMissing([], null, notifica, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(notifica);
      });

      it('should return initial array if no Notifica is added', () => {
        const notificaCollection: INotifica[] = [sampleWithRequiredData];
        expectedResult = service.addNotificaToCollectionIfMissing(notificaCollection, undefined, null);
        expect(expectedResult).toEqual(notificaCollection);
      });
    });

    describe('compareNotifica', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareNotifica(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 26327 };
        const entity2 = null;

        const compareResult1 = service.compareNotifica(entity1, entity2);
        const compareResult2 = service.compareNotifica(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 26327 };
        const entity2 = { id: 10814 };

        const compareResult1 = service.compareNotifica(entity1, entity2);
        const compareResult2 = service.compareNotifica(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 26327 };
        const entity2 = { id: 26327 };

        const compareResult1 = service.compareNotifica(entity1, entity2);
        const compareResult2 = service.compareNotifica(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
