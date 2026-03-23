import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IOrdine, NewOrdine } from '../ordine.model';

export type PartialUpdateOrdine = Partial<IOrdine> & Pick<IOrdine, 'id'>;

type RestOf<T extends IOrdine | NewOrdine> = Omit<T, 'dataCreazione'> & {
  dataCreazione?: string | null;
};

export type RestOrdine = RestOf<IOrdine>;

export type NewRestOrdine = RestOf<NewOrdine>;

export type PartialUpdateRestOrdine = RestOf<PartialUpdateOrdine>;

export type EntityResponseType = HttpResponse<IOrdine>;
export type EntityArrayResponseType = HttpResponse<IOrdine[]>;

@Injectable({ providedIn: 'root' })
export class OrdineService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/ordines', 'msordini');

  create(ordine: NewOrdine): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(ordine);
    return this.http
      .post<RestOrdine>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(ordine: IOrdine): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(ordine);
    return this.http
      .put<RestOrdine>(`${this.resourceUrl}/${this.getOrdineIdentifier(ordine)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(ordine: PartialUpdateOrdine): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(ordine);
    return this.http
      .patch<RestOrdine>(`${this.resourceUrl}/${this.getOrdineIdentifier(ordine)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestOrdine>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestOrdine[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getOrdineIdentifier(ordine: Pick<IOrdine, 'id'>): number {
    return ordine.id;
  }

  compareOrdine(o1: Pick<IOrdine, 'id'> | null, o2: Pick<IOrdine, 'id'> | null): boolean {
    return o1 && o2 ? this.getOrdineIdentifier(o1) === this.getOrdineIdentifier(o2) : o1 === o2;
  }

  addOrdineToCollectionIfMissing<Type extends Pick<IOrdine, 'id'>>(
    ordineCollection: Type[],
    ...ordinesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const ordines: Type[] = ordinesToCheck.filter(isPresent);
    if (ordines.length > 0) {
      const ordineCollectionIdentifiers = ordineCollection.map(ordineItem => this.getOrdineIdentifier(ordineItem));
      const ordinesToAdd = ordines.filter(ordineItem => {
        const ordineIdentifier = this.getOrdineIdentifier(ordineItem);
        if (ordineCollectionIdentifiers.includes(ordineIdentifier)) {
          return false;
        }
        ordineCollectionIdentifiers.push(ordineIdentifier);
        return true;
      });
      return [...ordinesToAdd, ...ordineCollection];
    }
    return ordineCollection;
  }

  protected convertDateFromClient<T extends IOrdine | NewOrdine | PartialUpdateOrdine>(ordine: T): RestOf<T> {
    return {
      ...ordine,
      dataCreazione: ordine.dataCreazione?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restOrdine: RestOrdine): IOrdine {
    return {
      ...restOrdine,
      dataCreazione: restOrdine.dataCreazione ? dayjs(restOrdine.dataCreazione) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestOrdine>): HttpResponse<IOrdine> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestOrdine[]>): HttpResponse<IOrdine[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
