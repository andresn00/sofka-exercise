import { computed, inject, Injectable, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { map, tap } from 'rxjs';
import { ProductsService } from '../services/products.service';
import { Product, UpdateProduct } from '../types/products.types';

@Injectable({
  providedIn: 'root',
})
export class ProductsStore {
  private productsService = inject(ProductsService);

  private _products = signal<Product[]>([]);
  readonly products = computed(() => this._products());
  readonly products$ = toObservable(this._products);

  constructor() {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productsService.getProducts().subscribe({
      next: (response) => {
        this._products.set(response.data);
      },
      error: () => {
        this._products.set([]);
      },
    });
  }

  getProduct(id: string) {
    return this.products$.pipe(map((products) => products.find((product) => product.id === id) || null));
  }

  createProduct(product: Product) {
    return this.productsService.createProduct(product).pipe(
      tap((response) => {
        this._products.update((current) => [...current, response.data]);
      })
    );
  }

  updateProduct(id: string, product: UpdateProduct) {
    return this.productsService.updateProduct(id, product).pipe(
      tap((response) => {
        this._products.update((current) =>
          current.map((product) => (product.id === id ? { ...product, ...response.data } : product))
        );
      })
    );
  }

  deleteProduct(id: string) {
    return this.productsService.deleteProduct(id).pipe(
      tap(() => {
        this._products.update((current) => current.filter((p) => p.id !== id));
      })
    );
  }
}
