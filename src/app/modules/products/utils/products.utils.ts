import { FormBuilder, Validators } from '@angular/forms';
import { INPUT_DATE_FORMAT } from '../../../constants/date.constants';
import { CustomValidators } from '../../../utils/custom-validators.utils';
import { FgProduct } from '../types/products.types';

export const buildProductForm = (fb: FormBuilder, mode: 'new' | 'edit', minDateRelease: Date | null): FgProduct => {
  const dateReleaseValidators = [Validators.required];
  if (minDateRelease) {
    dateReleaseValidators.push(CustomValidators.dateCompare(minDateRelease, INPUT_DATE_FORMAT, '>='));
  }

  return fb.nonNullable.group({
    id: [
      { value: '', disabled: mode === 'edit' },
      [Validators.required, Validators.minLength(3), Validators.maxLength(10)],
    ], // TODO async validator verify id
    name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
    description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
    logo: ['', [Validators.required]],
    date_release: ['', dateReleaseValidators],
    date_revision: [{ value: '', disabled: true }, [Validators.required]],
  });
};
