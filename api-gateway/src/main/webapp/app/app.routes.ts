import { Routes } from '@angular/router';

import { Authority } from 'app/config/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { errorRoute } from './layouts/error/error.route';

const routes: Routes = [
  // -- Home --
  {
    path: '',
    loadComponent: () => import('./home/home.component'),
    title: 'home.title',
  },

  // -- Navbar outlet --
  {
    path: '',
    loadComponent: () => import('./layouts/navbar/navbar.component'),
    outlet: 'navbar',
  },

  // ============================================================
  // VETRINA PUBBLICA — PRIMA delle entity routes JHipster
  // Nessun canActivate = accessibili da tutti, loggati e anonimi
  // ============================================================
  {
    path: 'catalogo',
    loadComponent: () => import('./negozio/catalogo/catalogo.component'),
    title: 'negozio.catalogo',
  },
  {
    path: 'catalogo/prodotti',
    loadComponent: () => import('./prodotto/prodotto.component').then(m => m.ProdottoComponent),
    title: 'negozio.prodotti',
  },
  {
    path: 'prodotto/:id',
    loadComponent: () => import('./negozio/prodotto/prodotto-dettaglio.component'),
    title: 'negozio.dettaglioProdotto',
  },
  {
    path: 'carrello',
    loadComponent: () => import('./negozio/carrello/carrello.component'),
    title: 'negozio.carrello',
  },
  {
    path: 'ordini',
    loadComponent: () => import('./negozio/ordini/ordini.component'),
    title: 'negozio.ordini',
  },

  // -- Admin (solo ROLE_ADMIN) --
  {
    path: 'admin',
    data: { authorities: [Authority.ADMIN] },
    canActivate: [UserRouteAccessService],
    loadChildren: () => import('./admin/admin.routes'),
  },

  // -- Account (login, register, ecc.) --
  {
    path: 'account',
    loadChildren: () => import('./account/account.route'),
  },

  // -- Login --
  {
    path: 'login',
    loadComponent: () => import('./login/login.component'),
    title: 'login.title',
  },

  // -- Entita JHipster (DOPO le route negozio) --
  {
    path: '',
    loadChildren: () => import('./entities/entity.routes'),
  },

  // -- Errori --
  ...errorRoute,
];

export default routes;
