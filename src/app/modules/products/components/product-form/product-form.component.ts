import { Component, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AppFormsModule } from '../../../forms/app-forms.module';
import { FgProduct } from '../../types/products.types';

@Component({
  selector: 'app-product-form',
  imports: [ReactiveFormsModule, AppFormsModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss',
})
export class ProductFormComponent {
  fgProduct = input.required<FgProduct>();
}
