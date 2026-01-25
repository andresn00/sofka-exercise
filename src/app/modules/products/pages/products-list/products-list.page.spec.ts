import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivatedRoute } from '@angular/router';
import { ProductsStore } from '../../store/products.store';
import { ProductsListPage } from './products-list.page';

const routeMock = {};
const productsStoreMock = {};

describe('ProductListPage', () => {
  let component: ProductsListPage;
  let fixture: ComponentFixture<ProductsListPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsListPage],
      providers: [
        { provide: ActivatedRoute, useValue: routeMock },
        { provide: ProductsStore, useValue: productsStoreMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
