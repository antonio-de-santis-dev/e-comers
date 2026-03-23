import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IRecensione, NewRecensione } from '../recensione.model';

export type PartialUpdateRecensione = Partial<IRecensione> & Pick<IRecensione, 'id'>;

type RestOf<T extends IRecensione | NewRecensione> = Omit<T, 'dataRecensione'> & {
  dataRecensione?: string | null;
};

export type RestRecensione = RestOf<IRecensione>;

export type NewRestRecensione = RestOf<NewRecensione>;

export type PartialUpdateRestRecensione = RestOf<PartialUpdateRecensione>;

export type EntityResponseType = HttpResponse<IRecensione>;
export type EntityArrayResponseType = HttpResponse<IRecensione[]>;

@Injectable({ providedIn: 'root' })
export class RecensioneService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/recensiones', 'msrecensioni');

  create(recensione: NewRecensione): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(recensione);
    return this.http
      .post<RestRecensione>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(recensione: IRecensione): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(recensione);
    return this.http
      .put<RestRecensione>(`${this.resourceUrl}/${this.getRecensioneIdentifier(recensione)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(recensione: PartialUpdateRecensione): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(recensione);
    return this.http
      .patch<RestRecensione>(`${this.resourceUrl}/${this.getRecensioneIdentifier(recensione)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestRecensione>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestRecensione[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getRecensioneIdentifier(recensione: Pick<IRecensione, 'id'>): number {
    return recensione.id;
  }

  compareRecensione(o1: Pick<IRecensione, 'id'> | null, o2: Pick<IRecensione, 'id'> | null): boolean {
    return o1 && o2 ? this.getRecensioneIdentifier(o1) === this.getRecensioneIdentifier(o2) : o1 === o2;
  }

  addRecensioneToCollectionIfMissing<Type extends Pick<IRecensione, 'id'>>(
    recensioneCollection: Type[],
    ...recensionesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const recensiones: Type[] = recensionesToCheck.filter(isPresent);
    if (recensiones.length > 0) {
      const recensioneCollectionIdentifiers = recensioneCollection.map(recensioneItem => this.getRecensioneIdentifier(recensioneItem));
      const recensionesToAdd = recensiones.filter(recensioneItem => {
        const recensioneIdentifier = this.getRecensioneIdentifier(recensioneItem);
        if (recensioneCollectionIdentifiers.includes(recensioneIdentifier)) {
          return false;
        }
        recensioneCollectionIdentifiers.push(recensioneIdentifier);
        return true;
      });
      return [...recensionesToAdd, ...recensioneCollection];
    }
    return recensioneCollection;
  }

  protected convertDateFromClient<T extends IRecensione | NewRecensione | PartialUpdateRecensione>(recensione: T): RestOf<T> {
    return {
      ...recensione,
      dataRecensione: recensione.dataRecensione?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restRecensione: RestRecensione): IRecensione {
    return {
      ...restRecensione,
      dataRecensione: restRecensione.dataRecensione ? dayjs(restRecensione.dataRecensione) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestRecensione>): HttpResponse<IRecensione> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestRecensione[]>): HttpResponse<IRecensione[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
