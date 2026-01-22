import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { addYears, format, parse } from 'date-fns';
import { ProductFormComponent } from '../../components/product-form/product-form.component';
import { ProductsService } from '../../services/products.service';
import { FgProduct, Product } from '../../types/products.types';

@Component({
  selector: 'app-edit-product',
  imports: [ProductFormComponent],
  templateUrl: './edit-product.page.html',
  styleUrl: './edit-product.page.scss',
})
export class EditProductPage {
  private productsService = inject(ProductsService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  private now = new Date();
  private dateFormat = 'yyyy-MM-dd';

  fgProduct: FgProduct = this.fb.nonNullable.group({
    id: [{ value: '', disabled: true }, [Validators.required, Validators.minLength(3), Validators.maxLength(10)]], // TODO async validator verify id
    name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
    description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
    logo: ['', [Validators.required]],
    date_release: ['', [Validators.required]], // TODO validate equal or greater than now
    date_revision: [{ value: '', disabled: true }, [Validators.required]], // TODO exactly one year later
  });

  constructor() {
    const product = this.router.getCurrentNavigation()?.extras.state as Product | undefined;
    if (product) {
      this.fgProduct.patchValue(product);
    }

    this.fgProduct.controls.date_release.valueChanges.pipe(takeUntilDestroyed()).subscribe((date) => {
      const parsedDate = parse(date, this.dateFormat, new Date());
      const oneYearLater = addYears(parsedDate, 1);
      const oneYearLaterFormatted = format(oneYearLater, this.dateFormat);
      this.fgProduct.controls.date_revision.setValue(oneYearLaterFormatted);
    });
  }

  onSubmit(): void {
    if (!this.fgProduct.valid) return;

    const product = this.fgProduct.getRawValue();
    this.productsService.updateProduct(product.id, product).subscribe(() => {
      this.router.navigate(['../..'], { relativeTo: this.route });
    });
  }

  onReset(): void {
    this.fgProduct.reset();
  }
}
