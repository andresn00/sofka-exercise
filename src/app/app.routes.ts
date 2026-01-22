import { Routes } from '@angular/router';
import { productsRoutes } from './modules/products/products.routes';

export const routes: Routes = [
  {
    path: 'products',
    children: productsRoutes,
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'products',
  },
];
