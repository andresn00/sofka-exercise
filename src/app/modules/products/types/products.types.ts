import { FormControl, FormGroup } from '@angular/forms';

export type Product = {
  id: string;
  name: string;
  description: string;
  logo: string;
  date_release: string;
  date_revision: string;
};

export type UpdateProduct = Omit<Product, 'id'>;

export type FgProduct = FormGroup<{
  id: FormControl<string>;
  name: FormControl<string>;
  description: FormControl<string>;
  logo: FormControl<string>;
  date_release: FormControl<string>;
  date_revision: FormControl<string>;
}>;
