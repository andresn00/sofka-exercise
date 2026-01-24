import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { INPUT_DATE_FORMAT } from '../../../../constants/date.constants';
import { AppFormsModule } from '../../../forms/app-forms.module';
import { FgProduct } from '../../types/products.types';

@Component({
  selector: 'app-product-form',
  imports: [DatePipe, ReactiveFormsModule, AppFormsModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductFormComponent {
  fgProduct = input.required<FgProduct>();
  minDateRelease = input.required<Date | null>();

  INPUT_DATE_FORMAT = INPUT_DATE_FORMAT;
}
