import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IRecensione } from '../recensione.model';
import { RecensioneService } from '../service/recensione.service';

const recensioneResolve = (route: ActivatedRouteSnapshot): Observable<null | IRecensione> => {
  const id = route.params.id;
  if (id) {
    return inject(RecensioneService)
      .find(id)
      .pipe(
        mergeMap((recensione: HttpResponse<IRecensione>) => {
          if (recensione.body) {
            return of(recensione.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default recensioneResolve;
