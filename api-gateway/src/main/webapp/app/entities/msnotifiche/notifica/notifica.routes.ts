import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import NotificaResolve from './route/notifica-routing-resolve.service';

const notificaRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/notifica.component').then(m => m.NotificaComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/notifica-detail.component').then(m => m.NotificaDetailComponent),
    resolve: {
      notifica: NotificaResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/notifica-update.component').then(m => m.NotificaUpdateComponent),
    resolve: {
      notifica: NotificaResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/notifica-update.component').then(m => m.NotificaUpdateComponent),
    resolve: {
      notifica: NotificaResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default notificaRoute;
