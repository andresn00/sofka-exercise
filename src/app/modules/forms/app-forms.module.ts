import { NgModule } from '@angular/core';
import { FormErrorComponent } from './components/form-error/form-error.component';
import { FormFieldComponent } from './components/form-field/form-field.component';

@NgModule({
  declarations: [],
  imports: [FormFieldComponent, FormErrorComponent],
  exports: [FormFieldComponent, FormErrorComponent],
})
export class AppFormsModule {}
