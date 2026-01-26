import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { addYears, format, parse } from 'date-fns';
import { catchError, EMPTY, filter, switchMap, tap } from 'rxjs';
import { INPUT_DATE_FORMAT } from '../../../../constants/date.constants';
import { ButtonDirective } from '../../../../directives/button/button.directive';
import { ToastService } from '../../../toast/services/toast.service';
import { ProductFormComponent } from '../../components/product-form/product-form.component';
import { ProductsService } from '../../services/products.service';
import { ProductsStore } from '../../store/products.store';
import { buildProductForm } from '../../utils/products.utils';

@Component({
  selector: 'app-new-product-page',
  imports: [ProductFormComponent, ButtonDirective],
  templateUrl: './new-product.page.html',
  styleUrl: './new-product.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewProductPage {
  private productsService = inject(ProductsService);
  private productsStore = inject(ProductsStore);
  private toastService = inject(ToastService);
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

    const product = this.fgProduct.getRawValue();
    this.productsService
      .verifyProduct(product.id)
      .pipe(
        catchError(() => EMPTY),
        tap((exists) => {
          if (!exists) return;
          this.fgProduct.controls.id.setErrors({ idExists: true });
          this.toastService.show('El producto ya existe', 'error');
        }),
        filter((exists) => !exists),
        switchMap(() => this.productsStore.createProduct(product).pipe(catchError(() => EMPTY)))
      )
      .subscribe(() => {
        this.router.navigate(['..'], { relativeTo: this.route });
        this.toastService.show('Producto creado', 'success');
      });
  }

  onReset(): void {
    this.fgProduct.reset();
  }
}
