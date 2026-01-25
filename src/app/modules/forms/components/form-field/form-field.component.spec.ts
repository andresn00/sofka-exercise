import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { take, toArray } from 'rxjs';
import { FormErrorComponent } from '../form-error/form-error.component';
import { FormFieldComponent } from './form-field.component';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, FormFieldComponent, FormErrorComponent],
  template: `
    <form [formGroup]="form">
      <app-form-field>
        <input formControlName="name" />
        <app-form-error></app-form-error>
      </app-form-field>
    </form>
  `,
})
class HostWithFormControlNameComponent {
  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
  });
}

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, FormFieldComponent, FormErrorComponent],
  template: `
    <app-form-field>
      <input [formControl]="control" />
      <app-form-error></app-form-error>
    </app-form-field>
  `,
})
class HostWithFormControlDirectiveComponent {
  control = new FormControl('', [Validators.required]);
}

@Component({
  standalone: true,
  imports: [FormFieldComponent],
  template: `<app-form-field></app-form-field>`,
})
class HostWithNoControlComponent {}

describe('FormFieldComponent', () => {
  describe('with FormControlName', () => {
    let fixture: ComponentFixture<HostWithFormControlNameComponent>;
    let host: HostWithFormControlNameComponent;
    let formField: FormFieldComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [HostWithFormControlNameComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(HostWithFormControlNameComponent);
      host = fixture.componentInstance;
      formField = fixture.debugElement.query(By.directive(FormFieldComponent)).componentInstance as FormFieldComponent;
      fixture.detectChanges();
    });

    it('should bind control from ControlContainer', () => {
      expect(formField.control).toBe(host.form.get('name'));
    });

    it('should pass control to FormErrorComponent', () => {
      const errorCmp = formField.formErrorComponent();
      expect(errorCmp?.control()).toBe(host.form.get('name'));
    });

    it('should emit isErrorActive$ when control becomes invalid, dirty and touched', (done) => {
      formField.isErrorActive$.pipe(take(2), toArray()).subscribe((values) => {
        expect(values).toEqual([false, true]);
        done();
      });
      const control = host.form.get('name')!;

      control.markAsTouched();
      control.markAsDirty();
      control.updateValueAndValidity();
      fixture.detectChanges();
    });

    it('should not activate error when control is pristine', (done) => {
      formField.isErrorActive$.pipe(take(2), toArray()).subscribe((values) => {
        expect(values).toEqual([false, false]);
        done();
      });

      const control = host.form.get('name')!;
      control.markAsTouched();
      control.updateValueAndValidity();
      fixture.detectChanges();
    });
  });

  describe('with FormControlDirective', () => {
    let fixture: ComponentFixture<HostWithFormControlDirectiveComponent>;
    let host: HostWithFormControlDirectiveComponent;
    let formField: FormFieldComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [HostWithFormControlDirectiveComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(HostWithFormControlDirectiveComponent);
      host = fixture.componentInstance;
      formField = fixture.debugElement.query(By.directive(FormFieldComponent)).componentInstance as FormFieldComponent;
      fixture.detectChanges();
    });

    it('should bind control from FormControlDirective', () => {
      expect(formField.control).toBe(host.control);
    });

    it('should link FormErrorComponent with control', () => {
      const errorCmp = formField.formErrorComponent();
      expect(errorCmp?.control()).toBe(host.control);
    });
  });

  describe('no control', () => {
    it('should warn when no control is provided', async () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation();

      await TestBed.configureTestingModule({
        imports: [HostWithNoControlComponent],
      }).compileComponents();

      const fixture = TestBed.createComponent(HostWithNoControlComponent);
      fixture.detectChanges();

      expect(warnSpy).toHaveBeenCalledWith('Form control not binded in app-form-field');

      warnSpy.mockRestore();
    });
  });
});
