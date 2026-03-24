import { Routes } from '@angular/router';

import { Authority } from 'app/config/authority.constants';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { errorRoute } from './layouts/error/error.route';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home/home.component'),
    title: 'home.title',
  },
  {
    path: '',
    loadComponent: () => import('./layouts/navbar/navbar.component'),
    outlet: 'navbar',
  },
  {
    path: 'admin',
    data: {
      authorities: [Authority.ADMIN],
    },
    canActivate: [UserRouteAccessService],
    loadChildren: () => import('./admin/admin.routes'),
  },
  {
    path: 'account',
    loadChildren: () => import('./account/account.route'),
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.component'),
    title: 'login.title',
  },
  {
    path: '',
    loadChildren: () => import(`./entities/entity.routes`),
  },
  // -------------------------------------------------------
  // ROUTE NEGOZIO (vetrina pubblica)
  // /catalogo  → usa il ProdottoComponent già sviluppato in /app/prodotto/
  //              (ha sidebar filtri, grid card, paginazione — stesso stile home)
  // /prodotto/:id → pagina dettaglio prodotto
  // -------------------------------------------------------
  {
    path: 'catalogo',
    loadComponent: () => import('./prodotto/prodotto.component').then(m => m.ProdottoComponent),
    title: 'Catalogo Prodotti',
  },
  {
    path: 'prodotto/:id',
    loadComponent: () => import('./negozio/prodotto/prodotto-dettaglio.component'),
    title: 'Dettaglio Prodotto',
  },
  {
    path: 'carrello',
    loadComponent: () => import('./negozio/carrello/carrello.component'),
    title: 'Carrello',
  },
  {
    path: 'ordini',
    loadComponent: () => import('./negozio/ordini/ordini.component'),
    title: 'I miei ordini',
  },
  ...errorRoute,
];

export default routes;
