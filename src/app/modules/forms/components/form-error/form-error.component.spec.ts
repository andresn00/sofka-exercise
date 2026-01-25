import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { FormErrorComponent } from './form-error.component';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, FormErrorComponent],
  template: `
    <app-form-error [errors]="errors">
      <span class="projected-error">Projected error</span>
    </app-form-error>
  `,
})
class HostComponent {
  errors = {
    required: 'This field is required',
  };
}

describe('FormErrorComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let component: FormErrorComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    component = fixture.debugElement.query(By.directive(FormErrorComponent)).componentInstance as FormErrorComponent;

    fixture.detectChanges();
  });

  it('should not show error initially', () => {
    const control = new FormControl('', Validators.required);
    component.control.set(control);

    control.updateValueAndValidity({ emitEvent: true });
    fixture.detectChanges();
    const errorContainer = fixture.debugElement.query(By.css('[data-testid="form-error"]'));
    expect(errorContainer).toBeFalsy();
  });

  it('should show error when control is invalid, dirty and touched', () => {
    const control = new FormControl('', Validators.required);
    component.control.set(control);
    fixture.detectChanges();

    control.updateValueAndValidity({ emitEvent: true });
    control.markAsTouched({ emitEvent: true });
    control.markAsDirty();
    control.updateValueAndValidity({ emitEvent: true });

    fixture.detectChanges();
    const errorContainer = fixture.debugElement.query(By.css('[data-testid="form-error"]'));
    expect(errorContainer).toBeTruthy();
  });
});
