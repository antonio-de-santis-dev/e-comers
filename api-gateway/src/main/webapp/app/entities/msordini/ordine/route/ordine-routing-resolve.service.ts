import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IOrdine } from '../ordine.model';
import { OrdineService } from '../service/ordine.service';

const ordineResolve = (route: ActivatedRouteSnapshot): Observable<null | IOrdine> => {
  const id = route.params.id;
  if (id) {
    return inject(OrdineService)
      .find(id)
      .pipe(
        mergeMap((ordine: HttpResponse<IOrdine>) => {
          if (ordine.body) {
            return of(ordine.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default ordineResolve;
