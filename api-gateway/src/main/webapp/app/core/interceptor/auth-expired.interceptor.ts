import { Injectable, inject } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

import { LoginService } from 'app/login/login.service';
import { StateStorageService } from 'app/core/auth/state-storage.service';

// Route pubbliche che non devono mai causare redirect al login
const PUBLIC_ROUTES = [
  '/catalogo',
  '/prodotto/',
  '/carrello',
  '/ordini',
];

@Injectable()
export class AuthExpiredInterceptor implements HttpInterceptor {
  private readonly loginService = inject(LoginService);
  private readonly stateStorageService = inject(StateStorageService);
  private readonly router = inject(Router);

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      tap({
        error: (err: HttpErrorResponse) => {
          if (err.status === 401 && err.url && !err.url.includes('api/account')) {
            // Non redirigere al login se siamo su una pagina pubblica
            const currentUrl = this.router.routerState.snapshot.url;
            const isPublicPage = PUBLIC_ROUTES.some(route => currentUrl.startsWith(route));

            if (!isPublicPage) {
              this.stateStorageService.storeUrl(currentUrl);
              this.loginService.logout();
              this.router.navigate(['/login']);
            }
          }
        },
      }),
    );
  }
}
