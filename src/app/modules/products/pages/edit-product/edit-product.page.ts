import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { addYears, format, parse } from 'date-fns';
import { switchMap } from 'rxjs';
import { INPUT_DATE_FORMAT } from '../../../../constants/date.constants';
import { ButtonDirective } from '../../../../directives/button/button.directive';
import { ProductFormComponent } from '../../components/product-form/product-form.component';
import { ProductsStore } from '../../store/products.store';
import { buildProductForm } from '../../utils/products.utils';

@Component({
  selector: 'app-edit-product',
  imports: [ProductFormComponent, ButtonDirective],
  templateUrl: './edit-product.page.html',
  styleUrl: './edit-product.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditProductPage {
  private productsStore = inject(ProductsStore);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  minDateRelease = new Date();

  fgProduct = buildProductForm(this.fb, 'edit', this.minDateRelease);

  product$ = this.route.paramMap.pipe(switchMap((params) => this.productsStore.getProduct(params.get('id') as string)));

  constructor() {
    this.product$.pipe(takeUntilDestroyed()).subscribe((product) => {
      if (!product) return;
      this.fgProduct.patchValue(product);
    });

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

    const product = this.fgProduct.getRawValue();
    this.productsStore.updateProduct(product.id, product).subscribe(() => {
      this.router.navigate(['../..'], { relativeTo: this.route });
    });
  }

  onReset(): void {
    this.fgProduct.reset();
  }
}
