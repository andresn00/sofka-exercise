import { AsyncPipe, JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  combineLatest,
  combineLatestWith,
  debounceTime,
  distinctUntilChanged,
  map,
  shareReplay,
  startWith,
} from 'rxjs';
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

  availableRowsToShow = [5, 10, 20];

  fcSearch = this.fb.nonNullable.control('');
  fcRows = this.fb.nonNullable.control(this.availableRowsToShow[0]);

  searchValue$ = this.fcSearch.valueChanges.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    startWith(this.fcSearch.value)
  );

  // TODO handle products state
  products$ = this.productsService.getProducts().pipe(
    map((res) => res.data),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  filteredProducts$ = combineLatest([this.products$, this.searchValue$]).pipe(
    map(([products, search]) =>
      !search
        ? products
        : products.filter((product) => {
            // TODO normalize texts
            return product.name.includes(search);
          })
    ),
    combineLatestWith(this.fcRows.valueChanges.pipe(startWith(this.fcRows.value))),
    map(([products, rows]) => products.slice(0, rows))
  );

  onDelete(id: string) {
    this.productsService.deleteProduct(id).subscribe(() => {
      // TODO remove from products state
    });
  }
}
