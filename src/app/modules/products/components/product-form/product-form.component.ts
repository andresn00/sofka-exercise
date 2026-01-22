import { Component, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ProductForm } from '../../types/products.types';

@Component({
  selector: 'app-product-form',
  imports: [ReactiveFormsModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss',
})
export class ProductFormComponent {
  fgProduct = input.required<ProductForm>();
}
