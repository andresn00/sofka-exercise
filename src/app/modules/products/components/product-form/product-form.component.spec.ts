import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormControl, FormGroup } from '@angular/forms';
import { ProductFormComponent } from './product-form.component';

describe('ProductFormComponent', () => {
  let component: ProductFormComponent;
  let fixture: ComponentFixture<ProductFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductFormComponent);
    component = fixture.componentInstance;
    const formMock = new FormGroup({
      id: new FormControl(''),
      name: new FormControl(''),
      description: new FormControl(''),
      logo: new FormControl(''),
      date_release: new FormControl(''),
      date_revision: new FormControl(''),
    });
    fixture.componentRef.setInput('fgProduct', formMock);
    fixture.componentRef.setInput('minDateRelease', new Date());
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
