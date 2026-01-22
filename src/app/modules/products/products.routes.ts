import { Routes } from '@angular/router';

export const productsRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./pages/products-list/products-list.page').then((m) => m.ProductsListPage),
  },
  {
    path: 'new',
    loadComponent: () => import('./pages/new-product/new-product.page').then((m) => m.NewProductPage),
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./pages/edit-product/edit-product.page').then((m) => m.EditProductPage),
  },
];
