import { TestBed } from '@angular/core/testing';
import { firstValueFrom, of, throwError } from 'rxjs';
import { ProductsService } from '../services/products.service';
import { Product, UpdateProduct } from '../types/products.types';
import { ProductsStore } from './products.store';

describe('ProductsStore', () => {
  let store: ProductsStore;
  let productsService: jest.Mocked<ProductsService>;

  const mockProducts: Product[] = [
    {
      id: '1',
      name: 'Product 1',
      description: 'desc 1',
      logo: 'logo1.png',
      date_release: '2026-01-01',
      date_revision: '2026-02-01',
    },
    {
      id: '2',
      name: 'Product 2',
      description: 'desc 2',
      logo: 'logo2.png',
      date_release: '2026-01-02',
      date_revision: '2026-02-02',
    },
  ];

  beforeEach(() => {
    const serviceMock: jest.Mocked<Partial<ProductsService>> = {
      getProducts: jest.fn(),
      verifyProduct: jest.fn(),
      createProduct: jest.fn(),
      updateProduct: jest.fn(),
      deleteProduct: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [ProductsStore, { provide: ProductsService, useValue: serviceMock }],
    });

    productsService = TestBed.inject(ProductsService) as jest.Mocked<ProductsService>;
  });

  describe('initialization', () => {
    it('should load products on creation', () => {
      productsService.getProducts.mockReturnValue(of({ data: mockProducts, message: 'ok' }));

      store = TestBed.inject(ProductsStore);

      expect(productsService.getProducts).toHaveBeenCalled();
      expect(store.products()).toEqual(mockProducts);
    });

    it('should set empty array when loadProducts fails', () => {
      productsService.getProducts.mockReturnValue(throwError(() => new Error('error')));

      store = TestBed.inject(ProductsStore);

      expect(store.products()).toEqual([]);
    });
  });

  describe('getProduct', () => {
    beforeEach(() => {
      productsService.getProducts.mockReturnValue(of({ data: mockProducts, message: 'ok' }));
      store = TestBed.inject(ProductsStore);
    });

    it('should return product by id', async () => {
      const product = await firstValueFrom(store.getProduct('1'));
      expect(product).toEqual(mockProducts[0]);
    });

    it('should return null if product is not found', async () => {
      const product = await firstValueFrom(store.getProduct('999'));
      expect(product).toBeNull();
    });
  });

  describe('createProduct', () => {
    beforeEach(() => {
      productsService.getProducts.mockReturnValue(of({ data: [], message: 'ok' }));
      store = TestBed.inject(ProductsStore);
    });

    it('should append created product to store', async () => {
      const newProduct: Product = {
        id: '3',
        name: 'New product',
        description: 'desc 3',
        logo: 'logo3.png',
        date_release: '2026-01-03',
        date_revision: '2026-02-03',
      };

      productsService.createProduct.mockReturnValue(of({ data: newProduct, message: 'ok' }));

      await firstValueFrom(store.createProduct(newProduct));

      expect(store.products()).toEqual([newProduct]);
    });
  });

  describe('updateProduct', () => {
    beforeEach(() => {
      productsService.getProducts.mockReturnValue(of({ data: mockProducts, message: 'ok' }));
      store = TestBed.inject(ProductsStore);
    });

    it('should update product in store', async () => {
      const update: UpdateProduct = {
        name: 'Updated name',
        description: 'desc updated',
        logo: 'logo1-updated.png',
        date_release: '2026-01-10',
        date_revision: '2026-02-10',
      };
      const id = '1';

      productsService.updateProduct.mockReturnValue(of({ data: { ...update, id }, message: 'ok' }));

      await firstValueFrom(store.updateProduct(id, update));

      expect(store.products()).toEqual([{ id, ...update }, mockProducts[1]]);
    });
  });

  describe('deleteProduct', () => {
    beforeEach(() => {
      productsService.getProducts.mockReturnValue(of({ data: mockProducts, message: 'ok' }));
      store = TestBed.inject(ProductsStore);
    });

    it('should remove product from store', async () => {
      productsService.deleteProduct.mockReturnValue(of({ message: 'ok' }));

      await firstValueFrom(store.deleteProduct('1'));

      expect(store.products()).toEqual([mockProducts[1]]);
    });
  });
});
