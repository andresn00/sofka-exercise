import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ProductsStore } from '../../store/products.store';
import { EditProductPage } from './edit-product.page';

const routeMock = { paramMap: of(new Map([['id', '1']])) };
const productsStoreMock = {};

describe('EditProductPage', () => {
  let component: EditProductPage;
  let fixture: ComponentFixture<EditProductPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditProductPage],
      providers: [
        { provide: ProductsStore, useValue: productsStoreMock },
        { provide: ActivatedRoute, useValue: routeMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditProductPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
