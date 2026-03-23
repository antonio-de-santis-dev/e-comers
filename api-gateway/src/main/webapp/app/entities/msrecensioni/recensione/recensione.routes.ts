import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import RecensioneResolve from './route/recensione-routing-resolve.service';

const recensioneRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/recensione.component').then(m => m.RecensioneComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/recensione-detail.component').then(m => m.RecensioneDetailComponent),
    resolve: {
      recensione: RecensioneResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/recensione-update.component').then(m => m.RecensioneUpdateComponent),
    resolve: {
      recensione: RecensioneResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/recensione-update.component').then(m => m.RecensioneUpdateComponent),
    resolve: {
      recensione: RecensioneResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default recensioneRoute;
