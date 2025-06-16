
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { Product } from '../../shared/models/product';
import { response } from 'express';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  baseURL = 'https://localhost:7091/api/'
  private http = inject(HttpClient);
  types: string[]=[];
  brands:string[]=[];

  getProducts(): Observable<Product[]> {
    console.log('🚀 Service getProducts çağrıldı');
    console.log('🌐 API URL:', this.baseURL + 'Product');
    
    return this.http.get<Product[]>(this.baseURL + 'Product').pipe(
      tap(response => {
        console.log('✅ Service - HTTP Response alındı:', response);
        console.log('📊 Response type:', typeof response);
        console.log('📋 Is Array?', Array.isArray(response));
        console.log('📏 Response length:', response?.length);
        
        if (response && response.length > 0) {
          console.log('🔍 İlk item:', response[0]);
          console.log('🔑 İlk item keys:', Object.keys(response[0]));
        }
      }),
      catchError(error => {
        console.error('❌ Service HTTP Error:', error);
        console.error('❌ Error status:', error.status);
        console.error('❌ Error message:', error.message);
        return throwError(() => error);
      })
    );
  }
  getBrands(){
    if(this.brands.length > 0) return;
    return this.http.get<string[]>(this.baseURL + 'brand').subscribe({
      next: response => this.brands = response
    })
  }

  getTypes(){
      if(this.types.length > 0) return;
    return this.http.get<string[]>(this.baseURL + 'products/type').subscribe({
      next: response => this.brands = response
    })
  }
}