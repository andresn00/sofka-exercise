import { TestBed } from '@angular/core/testing';

import { ProductsStore } from './products.store';

describe('ProductsStore', () => {
  let store: ProductsStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    store = TestBed.inject(ProductsStore);
  });

  it('should be created', () => {
    expect(store).toBeTruthy();
  });
});
