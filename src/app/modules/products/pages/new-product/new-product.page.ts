import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { addYears, format, parse } from 'date-fns';
import { ButtonDirective } from '../../../../directives/button/button.directive';
import { ProductFormComponent } from '../../components/product-form/product-form.component';
import { ProductsService } from '../../services/products.service';
import { FgProduct } from '../../types/products.types';

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

  private now = new Date();
  private dateFormat = 'yyyy-MM-dd';

  fgProduct: FgProduct = this.fb.nonNullable.group({
    id: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]], // TODO async validator verify id
    name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
    description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
    logo: ['', [Validators.required]],
    date_release: ['', [Validators.required]], // TODO validate equal or greater than now
    date_revision: [{ value: '', disabled: true }, [Validators.required]], // TODO exactly one year later
  });

  constructor() {
    this.fgProduct.controls.date_release.valueChanges.pipe(takeUntilDestroyed()).subscribe((date) => {
      const parsedDate = parse(date, this.dateFormat, new Date());
      const oneYearLater = addYears(parsedDate, 1);
      const oneYearLaterFormatted = format(oneYearLater, this.dateFormat);
      this.fgProduct.controls.date_revision.setValue(oneYearLaterFormatted);
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
