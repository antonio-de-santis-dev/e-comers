import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import OrdineResolve from './route/ordine-routing-resolve.service';

const ordineRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/ordine.component').then(m => m.OrdineComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/ordine-detail.component').then(m => m.OrdineDetailComponent),
    resolve: {
      ordine: OrdineResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/ordine-update.component').then(m => m.OrdineUpdateComponent),
    resolve: {
      ordine: OrdineResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/ordine-update.component').then(m => m.OrdineUpdateComponent),
    resolve: {
      ordine: OrdineResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default ordineRoute;
