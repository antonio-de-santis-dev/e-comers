import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IRigaOrdine } from '../riga-ordine.model';
import { RigaOrdineService } from '../service/riga-ordine.service';

const rigaOrdineResolve = (route: ActivatedRouteSnapshot): Observable<null | IRigaOrdine> => {
  const id = route.params.id;
  if (id) {
    return inject(RigaOrdineService)
      .find(id)
      .pipe(
        mergeMap((rigaOrdine: HttpResponse<IRigaOrdine>) => {
          if (rigaOrdine.body) {
            return of(rigaOrdine.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default rigaOrdineResolve;
