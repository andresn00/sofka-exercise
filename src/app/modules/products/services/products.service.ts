import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { GenericResponse } from '../../../types/api.types';
import { Product, UpdateProduct } from '../types/products.types';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private http = inject(HttpClient);

  private baseUrl = '/api/bp/products';

  getProducts(): Observable<GenericResponse<Product>> {
    return this.http.get<GenericResponse<Product>>(this.baseUrl);
  }

  verifyProduct(id: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/verification/${id}`);
  }

  createProduct(product: Product): Observable<GenericResponse<Product>> {
    return this.http.post<GenericResponse<Product>>(this.baseUrl, product);
  }

  updateProduct(id: string, product: UpdateProduct): Observable<GenericResponse<Product>> {
    return this.http
      .put<GenericResponse<UpdateProduct>>(`${this.baseUrl}/${id}`, product)
      .pipe(map((res) => ({ ...res, data: { ...res.data, id } })));
  }

  deleteProduct(id: string): Observable<GenericResponse> {
    return this.http.delete<GenericResponse>(`${this.baseUrl}/${id}`);
  }
}
