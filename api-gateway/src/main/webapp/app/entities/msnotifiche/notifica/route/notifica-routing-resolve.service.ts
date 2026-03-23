import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { INotifica } from '../notifica.model';
import { NotificaService } from '../service/notifica.service';

const notificaResolve = (route: ActivatedRouteSnapshot): Observable<null | INotifica> => {
  const id = route.params.id;
  if (id) {
    return inject(NotificaService)
      .find(id)
      .pipe(
        mergeMap((notifica: HttpResponse<INotifica>) => {
          if (notifica.body) {
            return of(notifica.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default notificaResolve;
