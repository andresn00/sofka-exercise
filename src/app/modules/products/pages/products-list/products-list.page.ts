import { AsyncPipe, JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { debounceTime, distinctUntilChanged, map, shareReplay, startWith, switchMap } from 'rxjs';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'app-product-list',
  imports: [AsyncPipe, JsonPipe, RouterLink, ReactiveFormsModule],
  templateUrl: './products-list.page.html',
  styleUrl: './products-list.page.scss',
})
export class ProductsListPage {
  private productsService = inject(ProductsService);
  private fb = inject(FormBuilder);

  fcSearch = this.fb.nonNullable.control('');

  // TODO handle products state
  products$ = this.productsService.getProducts().pipe(
    map((res) => res.data),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  filteredProducts$ = this.fcSearch.valueChanges.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    startWith(this.fcSearch.value),
    switchMap((search) =>
      !search
        ? this.products$
        : this.products$.pipe(
            map((products) =>
              products.filter((product) => {
                // TODO normalize texts
                return product.name.includes(search);
              })
            )
          )
    )
  );

  onDelete(id: string) {
    this.productsService.deleteProduct(id).subscribe(() => {
      // TODO remove from products state
    });
  }
}
