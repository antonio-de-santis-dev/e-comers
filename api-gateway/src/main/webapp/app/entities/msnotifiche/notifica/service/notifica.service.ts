import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { INotifica, NewNotifica } from '../notifica.model';

export type PartialUpdateNotifica = Partial<INotifica> & Pick<INotifica, 'id'>;

type RestOf<T extends INotifica | NewNotifica> = Omit<T, 'dataNotifica'> & {
  dataNotifica?: string | null;
};

export type RestNotifica = RestOf<INotifica>;

export type NewRestNotifica = RestOf<NewNotifica>;

export type PartialUpdateRestNotifica = RestOf<PartialUpdateNotifica>;

export type EntityResponseType = HttpResponse<INotifica>;
export type EntityArrayResponseType = HttpResponse<INotifica[]>;

@Injectable({ providedIn: 'root' })
export class NotificaService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/notificas', 'msnotifiche');

  create(notifica: NewNotifica): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(notifica);
    return this.http
      .post<RestNotifica>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(notifica: INotifica): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(notifica);
    return this.http
      .put<RestNotifica>(`${this.resourceUrl}/${this.getNotificaIdentifier(notifica)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(notifica: PartialUpdateNotifica): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(notifica);
    return this.http
      .patch<RestNotifica>(`${this.resourceUrl}/${this.getNotificaIdentifier(notifica)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestNotifica>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestNotifica[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getNotificaIdentifier(notifica: Pick<INotifica, 'id'>): number {
    return notifica.id;
  }

  compareNotifica(o1: Pick<INotifica, 'id'> | null, o2: Pick<INotifica, 'id'> | null): boolean {
    return o1 && o2 ? this.getNotificaIdentifier(o1) === this.getNotificaIdentifier(o2) : o1 === o2;
  }

  addNotificaToCollectionIfMissing<Type extends Pick<INotifica, 'id'>>(
    notificaCollection: Type[],
    ...notificasToCheck: (Type | null | undefined)[]
  ): Type[] {
    const notificas: Type[] = notificasToCheck.filter(isPresent);
    if (notificas.length > 0) {
      const notificaCollectionIdentifiers = notificaCollection.map(notificaItem => this.getNotificaIdentifier(notificaItem));
      const notificasToAdd = notificas.filter(notificaItem => {
        const notificaIdentifier = this.getNotificaIdentifier(notificaItem);
        if (notificaCollectionIdentifiers.includes(notificaIdentifier)) {
          return false;
        }
        notificaCollectionIdentifiers.push(notificaIdentifier);
        return true;
      });
      return [...notificasToAdd, ...notificaCollection];
    }
    return notificaCollection;
  }

  protected convertDateFromClient<T extends INotifica | NewNotifica | PartialUpdateNotifica>(notifica: T): RestOf<T> {
    return {
      ...notifica,
      dataNotifica: notifica.dataNotifica?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restNotifica: RestNotifica): INotifica {
    return {
      ...restNotifica,
      dataNotifica: restNotifica.dataNotifica ? dayjs(restNotifica.dataNotifica) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestNotifica>): HttpResponse<INotifica> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestNotifica[]>): HttpResponse<INotifica[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
