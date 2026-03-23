import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import StatisticaOrdineResolve from './route/statistica-ordine-routing-resolve.service';

const statisticaOrdineRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/statistica-ordine.component').then(m => m.StatisticaOrdineComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/statistica-ordine-detail.component').then(m => m.StatisticaOrdineDetailComponent),
    resolve: {
      statisticaOrdine: StatisticaOrdineResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/statistica-ordine-update.component').then(m => m.StatisticaOrdineUpdateComponent),
    resolve: {
      statisticaOrdine: StatisticaOrdineResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/statistica-ordine-update.component').then(m => m.StatisticaOrdineUpdateComponent),
    resolve: {
      statisticaOrdine: StatisticaOrdineResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default statisticaOrdineRoute;
