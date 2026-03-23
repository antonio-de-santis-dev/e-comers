import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import PagamentoResolve from './route/pagamento-routing-resolve.service';

const pagamentoRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/pagamento.component').then(m => m.PagamentoComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/pagamento-detail.component').then(m => m.PagamentoDetailComponent),
    resolve: {
      pagamento: PagamentoResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/pagamento-update.component').then(m => m.PagamentoUpdateComponent),
    resolve: {
      pagamento: PagamentoResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/pagamento-update.component').then(m => m.PagamentoUpdateComponent),
    resolve: {
      pagamento: PagamentoResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default pagamentoRoute;
