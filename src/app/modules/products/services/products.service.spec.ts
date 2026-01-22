import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { GenericResponse } from '../../../types/api.types';
import { Product, UpdateProduct } from '../types/products.types';
import { ProductsService } from './products.service';

describe('ProductsService', () => {
  let service: ProductsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProductsService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ProductsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getProducts', () => {
    it('should fetch all products', () => {
      const mockResponse: GenericResponse<Product> = {
        data: {
          id: '1',
          name: 'Product 1',
          description: 'Description 1',
          logo: 'logo1.png',
          date_release: '2024-01-01',
          date_revision: '2024-01-02',
        },
        message: 'Success',
      };

      service.getProducts().subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('/api/bp/products');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('verifyProduct', () => {
    it('should verify if product exists', () => {
      const productId = '1';

      service.verifyProduct(productId).subscribe((exists) => {
        expect(exists).toBe(true);
      });

      const req = httpMock.expectOne(`/api/bp/products/verification/${productId}`);
      expect(req.request.method).toBe('GET');
      req.flush(true);
    });

    it('should return false if product does not exist', () => {
      const productId = '999';

      service.verifyProduct(productId).subscribe((exists) => {
        expect(exists).toBe(false);
      });

      const req = httpMock.expectOne(`/api/bp/products/verification/${productId}`);
      expect(req.request.method).toBe('GET');
      req.flush(false);
    });
  });

  describe('createProduct', () => {
    it('should create a new product', () => {
      const newProduct: UpdateProduct = {
        name: 'New Product',
        description: 'New Description',
        logo: 'new-logo.png',
        date_release: '2024-01-10',
        date_revision: '2024-01-10',
      };
      const mockResponse: GenericResponse<Product> = {
        data: {
          id: '2',
          ...newProduct,
        },
        message: 'Product created successfully',
      };

      service.createProduct(newProduct as Product).subscribe((response) => {
        expect(response.data.id).toBe('2');
        expect(response.data.name).toBe('New Product');
      });

      const req = httpMock.expectOne('/api/bp/products');
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);
    });
  });

  describe('updateProduct', () => {
    it('should update an existing product', () => {
      const productId = '1';
      const updateData: UpdateProduct = {
        name: 'Updated Product',
        description: 'Updated Description',
        logo: 'updated-logo.png',
        date_release: '2024-01-01',
        date_revision: '2024-01-15',
      };
      const mockResponse: GenericResponse<UpdateProduct> = {
        data: updateData,
        message: 'Product updated successfully',
      };

      service.updateProduct(productId, updateData).subscribe((response) => {
        expect(response.data.id).toBe(productId);
        expect(response.data.name).toBe('Updated Product');
      });

      const req = httpMock.expectOne(`/api/bp/products/${productId}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updateData);
      req.flush(mockResponse);
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product', () => {
      const productId = '1';
      const mockResponse: GenericResponse = {
        message: 'Product deleted successfully',
      };

      service.deleteProduct(productId).subscribe((response) => {
        expect(response.message).toBe('Product deleted successfully');
      });

      const req = httpMock.expectOne(`/api/bp/products/${productId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(mockResponse);
    });
  });
});
