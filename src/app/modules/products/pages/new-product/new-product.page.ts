import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { addYears, format, parse } from 'date-fns';
import { INPUT_DATE_FORMAT } from '../../../../constants/date.constants';
import { ButtonDirective } from '../../../../directives/button/button.directive';
import { ProductFormComponent } from '../../components/product-form/product-form.component';
import { ProductsService } from '../../services/products.service';
import { buildProductForm } from '../../utils/products.utils';

@Component({
  selector: 'app-new-product',
  imports: [ProductFormComponent, ButtonDirective],
  templateUrl: './new-product.page.html',
  styleUrl: './new-product.page.scss',
})
export class NewProductPage {
  private productsService = inject(ProductsService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  minDateRelease = new Date();

  fgProduct = buildProductForm(this.fb, 'new', this.minDateRelease);

  constructor() {
    this.fgProduct.controls.date_release.valueChanges.pipe(takeUntilDestroyed()).subscribe((date) => {
      const fcDateRevision = this.fgProduct.controls.date_revision;
      if (!date) {
        fcDateRevision.setValue('');
        return;
      }
      const parsedDate = parse(date, INPUT_DATE_FORMAT, new Date());
      const oneYearLater = addYears(parsedDate, 1);
      const oneYearLaterFormatted = format(oneYearLater, INPUT_DATE_FORMAT);
      fcDateRevision.setValue(oneYearLaterFormatted);
    });
  }

  onSubmit(): void {
    if (!this.fgProduct.valid) return;

    this.productsService.createProduct(this.fgProduct.getRawValue()).subscribe(() => {
      this.router.navigate(['..'], { relativeTo: this.route });
    });
  }

  onReset(): void {
    this.fgProduct.reset();
  }
}
