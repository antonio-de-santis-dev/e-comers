import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPagamento, NewPagamento } from '../pagamento.model';

export type PartialUpdatePagamento = Partial<IPagamento> & Pick<IPagamento, 'id'>;

type RestOf<T extends IPagamento | NewPagamento> = Omit<T, 'dataOperazione'> & {
  dataOperazione?: string | null;
};

export type RestPagamento = RestOf<IPagamento>;

export type NewRestPagamento = RestOf<NewPagamento>;

export type PartialUpdateRestPagamento = RestOf<PartialUpdatePagamento>;

export type EntityResponseType = HttpResponse<IPagamento>;
export type EntityArrayResponseType = HttpResponse<IPagamento[]>;

@Injectable({ providedIn: 'root' })
export class PagamentoService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/pagamentos', 'mspagamenti');

  create(pagamento: NewPagamento): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(pagamento);
    return this.http
      .post<RestPagamento>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(pagamento: IPagamento): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(pagamento);
    return this.http
      .put<RestPagamento>(`${this.resourceUrl}/${this.getPagamentoIdentifier(pagamento)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(pagamento: PartialUpdatePagamento): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(pagamento);
    return this.http
      .patch<RestPagamento>(`${this.resourceUrl}/${this.getPagamentoIdentifier(pagamento)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestPagamento>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestPagamento[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getPagamentoIdentifier(pagamento: Pick<IPagamento, 'id'>): number {
    return pagamento.id;
  }

  comparePagamento(o1: Pick<IPagamento, 'id'> | null, o2: Pick<IPagamento, 'id'> | null): boolean {
    return o1 && o2 ? this.getPagamentoIdentifier(o1) === this.getPagamentoIdentifier(o2) : o1 === o2;
  }

  addPagamentoToCollectionIfMissing<Type extends Pick<IPagamento, 'id'>>(
    pagamentoCollection: Type[],
    ...pagamentosToCheck: (Type | null | undefined)[]
  ): Type[] {
    const pagamentos: Type[] = pagamentosToCheck.filter(isPresent);
    if (pagamentos.length > 0) {
      const pagamentoCollectionIdentifiers = pagamentoCollection.map(pagamentoItem => this.getPagamentoIdentifier(pagamentoItem));
      const pagamentosToAdd = pagamentos.filter(pagamentoItem => {
        const pagamentoIdentifier = this.getPagamentoIdentifier(pagamentoItem);
        if (pagamentoCollectionIdentifiers.includes(pagamentoIdentifier)) {
          return false;
        }
        pagamentoCollectionIdentifiers.push(pagamentoIdentifier);
        return true;
      });
      return [...pagamentosToAdd, ...pagamentoCollection];
    }
    return pagamentoCollection;
  }

  protected convertDateFromClient<T extends IPagamento | NewPagamento | PartialUpdatePagamento>(pagamento: T): RestOf<T> {
    return {
      ...pagamento,
      dataOperazione: pagamento.dataOperazione?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restPagamento: RestPagamento): IPagamento {
    return {
      ...restPagamento,
      dataOperazione: restPagamento.dataOperazione ? dayjs(restPagamento.dataOperazione) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestPagamento>): HttpResponse<IPagamento> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestPagamento[]>): HttpResponse<IPagamento[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
