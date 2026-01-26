import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PopoverComponent } from '../../../../components/popover/popover.component';
import { ButtonDirective } from '../../../../directives/button/button.directive';
import { Product } from '../../types/products.types';

@Component({
  selector: 'app-products-list',
  imports: [RouterLink, DatePipe, PopoverComponent, ButtonDirective],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsListComponent {
  products = input.required<Product[]>();
  dateFormat = 'dd/MM/yyyy';

  delete = output<string>();
}
