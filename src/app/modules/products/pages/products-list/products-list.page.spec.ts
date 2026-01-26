import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { ProductsListComponent } from '../../components/products-list/products-list.component';
import { ProductsStore } from '../../store/products.store';
import { Product } from '../../types/products.types';
import { ProductsListPage } from './products-list.page';

const routeMock = {};

class ProductsStoreMock {
  private productsSubject = new BehaviorSubject<Product[]>([]);
  products$ = this.productsSubject.asObservable();

  setProducts(products: Product[]) {
    this.productsSubject.next(products);
  }

  deleteProduct = jest.fn(() => of(void 0));
}

describe('ProductsListPage', () => {
  let fixture: ComponentFixture<ProductsListPage>;
  let component: ProductsListPage;
  let listComponent: ProductsListComponent;
  let store: ProductsStoreMock;

  const productsMock: Product[] = [
    {
      id: '1',
      name: 'Producto uno',
      description: 'Desc 1',
      logo: 'asdasd',
      date_release: '2024-01-01',
      date_revision: '2025-01-01',
    },
    {
      id: '2',
      name: 'Producto dos',
      description: 'Desc 2',
      logo: 'asdasd',
      date_release: '2024-01-02',
      date_revision: '2025-01-02',
    },
    {
      id: '3',
      name: 'Producto tres',
      description: 'Desc 3',
      logo: 'asdasd',
      date_release: '2024-01-03',
      date_revision: '2025-01-03',
    },
  ];

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsListPage, ReactiveFormsModule],
      providers: [
        { provide: ProductsStore, useClass: ProductsStoreMock },
        { provide: ActivatedRoute, useValue: routeMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsListPage);
    component = fixture.componentInstance;
    listComponent = fixture.debugElement.query(By.css('app-products-list')).componentInstance as ProductsListComponent;
    store = TestBed.inject(ProductsStore) as unknown as ProductsStoreMock;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should render products from the store', () => {
    store.setProducts(productsMock);

    fixture.detectChanges();

    expect(listComponent.products().length).toBe(3);
  });

  it('should filter products by search value', async () => {
    store.setProducts(productsMock);
    fixture.detectChanges();

    component.fcSearch.setValue('uNo');

    // debounceTime(300)
    jest.advanceTimersByTime(300);
    fixture.detectChanges();

    expect(listComponent.products()).toEqual([productsMock[0]]);
  });

  it('should limit products by selected rows', () => {
    store.setProducts(productsMock);
    fixture.detectChanges();

    component.fcRows.setValue(2);
    fixture.detectChanges();

    expect(listComponent.products().length).toBe(2);
  });

  it('should call deleteProduct on store when onDelete is called', () => {
    component.onDelete('1');

    expect(store.deleteProduct).toHaveBeenCalledWith('1');
  });
});
