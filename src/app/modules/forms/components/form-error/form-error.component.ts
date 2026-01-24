import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { AbstractControl, FormGroup, PristineChangeEvent, StatusChangeEvent, TouchedChangeEvent } from '@angular/forms';
import { combineLatest, filter, map, switchMap } from 'rxjs';

@Component({
  selector: 'app-form-error',
  imports: [AsyncPipe],
  templateUrl: './form-error.component.html',
  styleUrl: './form-error.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormErrorComponent {
  errors = input<Record<string, string>>();
  control = signal<AbstractControl | undefined>(undefined); // Binded by form field
  styleClass = input<string>('');

  errors$ = toObservable(this.errors);
  control$ = toObservable(this.control).pipe(filter(Boolean));

  vmError$ = combineLatest([this.control$, this.errors$]).pipe(
    switchMap(([control, errors]) =>
      control.events.pipe(
        filter(
          (event) =>
            event instanceof TouchedChangeEvent ||
            event instanceof StatusChangeEvent ||
            event instanceof PristineChangeEvent
        ),
        map(() => {
          const errorKey = errors && Object.keys(errors).find((key) => control.hasError(key));
          const someChildrenIsInvalid =
            control instanceof FormGroup && Object.values(control.controls).some((child) => !child.valid);
          if (someChildrenIsInvalid) {
            return {
              showError: false,
              errorMessage: null,
            };
          }
          return {
            showError: control.invalid && control.dirty && control.touched,
            errorMessage: errorKey && errors?.[errorKey],
          };
        })
      )
    )
  );
}
