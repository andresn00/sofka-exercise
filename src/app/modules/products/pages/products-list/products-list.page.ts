import { AsyncPipe, JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'app-product-list',
  imports: [AsyncPipe, JsonPipe, RouterLink],
  templateUrl: './products-list.page.html',
  styleUrl: './products-list.page.scss',
})
export class ProductsListPage {
  private productsService = inject(ProductsService);

  products$ = this.productsService.getProducts().pipe(map((res) => res.data));
}
