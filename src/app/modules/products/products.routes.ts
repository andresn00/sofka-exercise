import { Routes } from '@angular/router';

export const productsRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./pages/products-list/products-list.page').then((m) => m.ProductsListPage),
  },
];
