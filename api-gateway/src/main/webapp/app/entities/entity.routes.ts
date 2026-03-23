import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'authority',
    data: { pageTitle: 'apiGatewayApp.adminAuthority.home.title' },
    loadChildren: () => import('./admin/authority/authority.routes'),
  },
  {
    path: 'categoria',
    data: { pageTitle: 'apiGatewayApp.mscatalogoCategoria.home.title' },
    loadChildren: () => import('./mscatalogo/categoria/categoria.routes'),
  },
  {
    path: 'prodotto',
    data: { pageTitle: 'apiGatewayApp.mscatalogoProdotto.home.title' },
    loadChildren: () => import('./mscatalogo/prodotto/prodotto.routes'),
  },
  {
    path: 'ordine',
    data: { pageTitle: 'apiGatewayApp.msordiniOrdine.home.title' },
    loadChildren: () => import('./msordini/ordine/ordine.routes'),
  },
  {
    path: 'riga-ordine',
    data: { pageTitle: 'apiGatewayApp.msordiniRigaOrdine.home.title' },
    loadChildren: () => import('./msordini/riga-ordine/riga-ordine.routes'),
  },
  {
    path: 'pagamento',
    data: { pageTitle: 'apiGatewayApp.mspagamentiPagamento.home.title' },
    loadChildren: () => import('./mspagamenti/pagamento/pagamento.routes'),
  },
  {
    path: 'recensione',
    data: { pageTitle: 'apiGatewayApp.msrecensioniRecensione.home.title' },
    loadChildren: () => import('./msrecensioni/recensione/recensione.routes'),
  },
  {
    path: 'notifica',
    data: { pageTitle: 'apiGatewayApp.msnotificheNotifica.home.title' },
    loadChildren: () => import('./msnotifiche/notifica/notifica.routes'),
  },
  {
    path: 'statistica-ordine',
    data: { pageTitle: 'apiGatewayApp.msadminStatisticaOrdine.home.title' },
    loadChildren: () => import('./msadmin/statistica-ordine/statistica-ordine.routes'),
  },
  /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
];

export default routes;
