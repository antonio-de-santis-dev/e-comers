import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IStatisticaOrdine } from '../statistica-ordine.model';
import { StatisticaOrdineService } from '../service/statistica-ordine.service';

const statisticaOrdineResolve = (route: ActivatedRouteSnapshot): Observable<null | IStatisticaOrdine> => {
  const id = route.params.id;
  if (id) {
    return inject(StatisticaOrdineService)
      .find(id)
      .pipe(
        mergeMap((statisticaOrdine: HttpResponse<IStatisticaOrdine>) => {
          if (statisticaOrdine.body) {
            return of(statisticaOrdine.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default statisticaOrdineResolve;
