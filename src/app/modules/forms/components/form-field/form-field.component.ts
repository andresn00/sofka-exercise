import { AsyncPipe } from '@angular/common';
import { AfterContentInit, ChangeDetectionStrategy, Component, contentChild, inject, input } from '@angular/core';
import {
  ControlContainer,
  FormControl,
  FormControlDirective,
  FormControlName,
  PristineChangeEvent,
  StatusChangeEvent,
  TouchedChangeEvent,
} from '@angular/forms';
import { filter, map, Observable } from 'rxjs';
import { FormErrorComponent } from '../form-error/form-error.component';

@Component({
  selector: 'app-form-field',
  imports: [AsyncPipe],
  templateUrl: './form-field.component.html',
  styleUrl: './form-field.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormFieldComponent implements AfterContentInit {
  private controlContainer = inject(ControlContainer, { optional: true, skipSelf: true });

  reserveMessageSpace = input(true);

  control: FormControl | undefined;
  isErrorActive$!: Observable<boolean>;

  formControlDirective = contentChild(FormControlDirective);
  formControlName = contentChild(FormControlName);

  formErrorComponent = contentChild(FormErrorComponent);

  ngAfterContentInit(): void {
    this.bindControl();
    this.bindControlInFormError();
    this.setupErrorChanges();
  }

  private bindControl() {
    if (this.formControlDirective()) {
      this.control = this.formControlDirective()!.control;
      return;
    }

    const controlName = this.formControlName()?.name;
    if (this.controlContainer && controlName) {
      this.control = this.controlContainer.control?.get(controlName.toString()) as FormControl;
      return;
    }
    console.warn('Form control not binded in app-form-field');
  }

  private bindControlInFormError() {
    if (!this.control || !this.formErrorComponent()) return;
    this.formErrorComponent()!.control.set(this.control);
  }

  private setupErrorChanges() {
    if (!this.control || !this.formErrorComponent()) return;

    this.isErrorActive$ = this.control.events.pipe(
      filter(
        (event) =>
          event instanceof TouchedChangeEvent ||
          event instanceof StatusChangeEvent ||
          event instanceof PristineChangeEvent
      ),
      map(() => this.control!.invalid && this.control!.dirty && this.control!.touched)
    );
  }
}
