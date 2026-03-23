import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPagamento } from '../pagamento.model';
import { PagamentoService } from '../service/pagamento.service';

const pagamentoResolve = (route: ActivatedRouteSnapshot): Observable<null | IPagamento> => {
  const id = route.params.id;
  if (id) {
    return inject(PagamentoService)
      .find(id)
      .pipe(
        mergeMap((pagamento: HttpResponse<IPagamento>) => {
          if (pagamento.body) {
            return of(pagamento.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default pagamentoResolve;
