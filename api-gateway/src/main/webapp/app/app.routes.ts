import { Routes } from '@angular/router';

import { Authority } from 'app/config/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { errorRoute } from './layouts/error/error.route';

const routes: Routes = [
  // ── Home ────────────────────────────────────────────────────
  {
    path: '',
    loadComponent: () => import('./home/home.component'),
    title: 'home.title',
  },

  // ── Navbar (outlet) ──────────────────────────────────────────
  {
    path: '',
    loadComponent: () => import('./layouts/navbar/navbar.component'),
    outlet: 'navbar',
  },

  // ── Admin ────────────────────────────────────────────────────
  {
    path: 'admin',
    data: { authorities: [Authority.ADMIN] },
    canActivate: [UserRouteAccessService],
    loadChildren: () => import('./admin/admin.routes'),
  },

  // ── Account ──────────────────────────────────────────────────
  {
    path: 'account',
    loadChildren: () => import('./account/account.route'),
  },

  // ── Login ────────────────────────────────────────────────────
  {
    path: 'login',
    loadComponent: () => import('./login/login.component'),
    title: 'login.title',
  },

  // ── Entità JHipster ──────────────────────────────────────────
  {
    path: '',
    loadChildren: () => import('./entities/entity.routes'),
  },

  // ═══════════════════════════════════════════════════════════════
  //  ROUTE NEGOZIO (vetrina pubblica)
  //
  //  /catalogo             → Home catalogo: lista verticale categorie
  //  /catalogo/prodotti    → Lista prodotti (con filtri sidebar)
  //  /prodotto/:id         → Dettaglio prodotto (pagina intera)
  //  /carrello             → Carrello acquisti
  //  /ordini               → I miei ordini
  // ═══════════════════════════════════════════════════════════════

  {
    // Home catalogo: mostra la lista verticale delle categorie
    // Modifica la destinazione qui se vuoi un componente diverso
    path: 'catalogo',
    loadComponent: () => import('./negozio/catalogo/catalogo.component'),
    title: 'Catalogo',
  },
  {
    // Lista prodotti con filtri (redirige dalla home catalogo)
    // Questo è il ProdottoComponent già sviluppato in /prodotto/
    path: 'catalogo/prodotti',
    loadComponent: () => import('./prodotto/prodotto.component').then(m => m.ProdottoComponent),
    title: 'Prodotti',
  },
  {
    // Pagina dettaglio prodotto — navigazione da qualunque card
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

  // ── Errori ───────────────────────────────────────────────────
  ...errorRoute,
];

export default routes;
