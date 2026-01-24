import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonDirective } from './button.directive';

@Component({
  imports: [ButtonDirective],
  template: `<button appButton [color]="color">Test</button>`,
})
class TestButtonComponent {
  color: 'primary' | 'secondary' | 'danger' = 'primary';
}

describe.only('ButtonDirective', () => {
  let fixture: ComponentFixture<TestButtonComponent>;
  let button: HTMLButtonElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestButtonComponent, ButtonDirective],
    });
    fixture = TestBed.createComponent(TestButtonComponent);
    fixture.detectChanges();
    const nativeElement = fixture.nativeElement as HTMLElement;
    button = nativeElement.querySelector('button') as HTMLButtonElement;
  });

  it('should add default btn and btn-color-primary classes', () => {
    expect(button.classList.contains('btn')).toBe(true);
    expect(button.classList.contains('btn-color-primary')).toBe(true);
  });

  it('should update class when color changes', () => {
    fixture.componentInstance.color = 'danger';
    fixture.detectChanges();
    expect(button.classList.contains('btn-color-danger')).toBe(true);
    expect(button.classList.contains('btn-color-primary')).toBeFalsy();
  });
});
