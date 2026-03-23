import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import RigaOrdineResolve from './route/riga-ordine-routing-resolve.service';

const rigaOrdineRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/riga-ordine.component').then(m => m.RigaOrdineComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/riga-ordine-detail.component').then(m => m.RigaOrdineDetailComponent),
    resolve: {
      rigaOrdine: RigaOrdineResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/riga-ordine-update.component').then(m => m.RigaOrdineUpdateComponent),
    resolve: {
      rigaOrdine: RigaOrdineResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/riga-ordine-update.component').then(m => m.RigaOrdineUpdateComponent),
    resolve: {
      rigaOrdine: RigaOrdineResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default rigaOrdineRoute;
