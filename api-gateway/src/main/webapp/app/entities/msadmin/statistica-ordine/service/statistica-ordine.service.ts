import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IStatisticaOrdine, NewStatisticaOrdine } from '../statistica-ordine.model';

export type PartialUpdateStatisticaOrdine = Partial<IStatisticaOrdine> & Pick<IStatisticaOrdine, 'id'>;

type RestOf<T extends IStatisticaOrdine | NewStatisticaOrdine> = Omit<T, 'dataRegistrazione'> & {
  dataRegistrazione?: string | null;
};

export type RestStatisticaOrdine = RestOf<IStatisticaOrdine>;

export type NewRestStatisticaOrdine = RestOf<NewStatisticaOrdine>;

export type PartialUpdateRestStatisticaOrdine = RestOf<PartialUpdateStatisticaOrdine>;

export type EntityResponseType = HttpResponse<IStatisticaOrdine>;
export type EntityArrayResponseType = HttpResponse<IStatisticaOrdine[]>;

@Injectable({ providedIn: 'root' })
export class StatisticaOrdineService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/statistica-ordines', 'msadmin');

  create(statisticaOrdine: NewStatisticaOrdine): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(statisticaOrdine);
    return this.http
      .post<RestStatisticaOrdine>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(statisticaOrdine: IStatisticaOrdine): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(statisticaOrdine);
    return this.http
      .put<RestStatisticaOrdine>(`${this.resourceUrl}/${this.getStatisticaOrdineIdentifier(statisticaOrdine)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(statisticaOrdine: PartialUpdateStatisticaOrdine): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(statisticaOrdine);
    return this.http
      .patch<RestStatisticaOrdine>(`${this.resourceUrl}/${this.getStatisticaOrdineIdentifier(statisticaOrdine)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestStatisticaOrdine>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestStatisticaOrdine[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getStatisticaOrdineIdentifier(statisticaOrdine: Pick<IStatisticaOrdine, 'id'>): number {
    return statisticaOrdine.id;
  }

  compareStatisticaOrdine(o1: Pick<IStatisticaOrdine, 'id'> | null, o2: Pick<IStatisticaOrdine, 'id'> | null): boolean {
    return o1 && o2 ? this.getStatisticaOrdineIdentifier(o1) === this.getStatisticaOrdineIdentifier(o2) : o1 === o2;
  }

  addStatisticaOrdineToCollectionIfMissing<Type extends Pick<IStatisticaOrdine, 'id'>>(
    statisticaOrdineCollection: Type[],
    ...statisticaOrdinesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const statisticaOrdines: Type[] = statisticaOrdinesToCheck.filter(isPresent);
    if (statisticaOrdines.length > 0) {
      const statisticaOrdineCollectionIdentifiers = statisticaOrdineCollection.map(statisticaOrdineItem =>
        this.getStatisticaOrdineIdentifier(statisticaOrdineItem),
      );
      const statisticaOrdinesToAdd = statisticaOrdines.filter(statisticaOrdineItem => {
        const statisticaOrdineIdentifier = this.getStatisticaOrdineIdentifier(statisticaOrdineItem);
        if (statisticaOrdineCollectionIdentifiers.includes(statisticaOrdineIdentifier)) {
          return false;
        }
        statisticaOrdineCollectionIdentifiers.push(statisticaOrdineIdentifier);
        return true;
      });
      return [...statisticaOrdinesToAdd, ...statisticaOrdineCollection];
    }
    return statisticaOrdineCollection;
  }

  protected convertDateFromClient<T extends IStatisticaOrdine | NewStatisticaOrdine | PartialUpdateStatisticaOrdine>(
    statisticaOrdine: T,
  ): RestOf<T> {
    return {
      ...statisticaOrdine,
      dataRegistrazione: statisticaOrdine.dataRegistrazione?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restStatisticaOrdine: RestStatisticaOrdine): IStatisticaOrdine {
    return {
      ...restStatisticaOrdine,
      dataRegistrazione: restStatisticaOrdine.dataRegistrazione ? dayjs(restStatisticaOrdine.dataRegistrazione) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestStatisticaOrdine>): HttpResponse<IStatisticaOrdine> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestStatisticaOrdine[]>): HttpResponse<IStatisticaOrdine[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
