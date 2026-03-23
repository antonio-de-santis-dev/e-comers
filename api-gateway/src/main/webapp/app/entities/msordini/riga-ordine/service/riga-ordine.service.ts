import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IRigaOrdine, NewRigaOrdine } from '../riga-ordine.model';

export type PartialUpdateRigaOrdine = Partial<IRigaOrdine> & Pick<IRigaOrdine, 'id'>;

export type EntityResponseType = HttpResponse<IRigaOrdine>;
export type EntityArrayResponseType = HttpResponse<IRigaOrdine[]>;

@Injectable({ providedIn: 'root' })
export class RigaOrdineService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/riga-ordines', 'msordini');

  create(rigaOrdine: NewRigaOrdine): Observable<EntityResponseType> {
    return this.http.post<IRigaOrdine>(this.resourceUrl, rigaOrdine, { observe: 'response' });
  }

  update(rigaOrdine: IRigaOrdine): Observable<EntityResponseType> {
    return this.http.put<IRigaOrdine>(`${this.resourceUrl}/${this.getRigaOrdineIdentifier(rigaOrdine)}`, rigaOrdine, {
      observe: 'response',
    });
  }

  partialUpdate(rigaOrdine: PartialUpdateRigaOrdine): Observable<EntityResponseType> {
    return this.http.patch<IRigaOrdine>(`${this.resourceUrl}/${this.getRigaOrdineIdentifier(rigaOrdine)}`, rigaOrdine, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IRigaOrdine>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IRigaOrdine[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getRigaOrdineIdentifier(rigaOrdine: Pick<IRigaOrdine, 'id'>): number {
    return rigaOrdine.id;
  }

  compareRigaOrdine(o1: Pick<IRigaOrdine, 'id'> | null, o2: Pick<IRigaOrdine, 'id'> | null): boolean {
    return o1 && o2 ? this.getRigaOrdineIdentifier(o1) === this.getRigaOrdineIdentifier(o2) : o1 === o2;
  }

  addRigaOrdineToCollectionIfMissing<Type extends Pick<IRigaOrdine, 'id'>>(
    rigaOrdineCollection: Type[],
    ...rigaOrdinesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const rigaOrdines: Type[] = rigaOrdinesToCheck.filter(isPresent);
    if (rigaOrdines.length > 0) {
      const rigaOrdineCollectionIdentifiers = rigaOrdineCollection.map(rigaOrdineItem => this.getRigaOrdineIdentifier(rigaOrdineItem));
      const rigaOrdinesToAdd = rigaOrdines.filter(rigaOrdineItem => {
        const rigaOrdineIdentifier = this.getRigaOrdineIdentifier(rigaOrdineItem);
        if (rigaOrdineCollectionIdentifiers.includes(rigaOrdineIdentifier)) {
          return false;
        }
        rigaOrdineCollectionIdentifiers.push(rigaOrdineIdentifier);
        return true;
      });
      return [...rigaOrdinesToAdd, ...rigaOrdineCollection];
    }
    return rigaOrdineCollection;
  }
}
