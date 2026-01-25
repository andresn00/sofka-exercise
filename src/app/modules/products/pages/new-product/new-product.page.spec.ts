import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../services/products.service';
import { ProductsStore } from '../../store/products.store';
import { NewProductPage } from './new-product.page';

const routeMock = {};
const productsStoreMock = {};
const productsServiceMock = {};

describe('NewProductPage', () => {
  let component: NewProductPage;
  let fixture: ComponentFixture<NewProductPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewProductPage],
      providers: [
        { provide: ProductsStore, useValue: productsStoreMock },
        { provide: ProductsService, useValue: productsServiceMock },
        { provide: ActivatedRoute, useValue: routeMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NewProductPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
