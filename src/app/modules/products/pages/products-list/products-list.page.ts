import { AsyncPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
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
import { ButtonDirective } from '../../../../directives/button/button.directive';
import { FormFieldComponent } from '../../../forms/components/form-field/form-field.component';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'app-product-list',
  imports: [AsyncPipe, DatePipe, RouterLink, ReactiveFormsModule, ButtonDirective, FormFieldComponent],
  templateUrl: './products-list.page.html',
  styleUrl: './products-list.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsListPage {
  private productsService = inject(ProductsService);
  private fb = inject(FormBuilder);

  availableRowsToShow = [5, 10, 20];
  dateFormat = 'dd/MM/yyyy';

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
