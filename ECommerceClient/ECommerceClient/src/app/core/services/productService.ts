import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { Product } from '../../shared/models/product';
import { Brand } from '../../shared/models/brands';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  baseURL = 'https://localhost:7091/api/';
  private http = inject(HttpClient);
  types: string[] = [];
  brands: Brand[] = [];

  getProducts(brands?: Brand[], types?: string[]): Observable<Product[]> {
    console.log('🚀 Service getProducts çağrıldı');
    console.log('🌐 API URL:', this.baseURL + 'Product');
    
    let params = new HttpParams();
    
    // Brand filtreleme
    if (brands && brands.length > 0) {
      // Brand objesinden ID veya name değerini al
      const brandValues = brands.map(brand => brand.id || brand.name).filter(Boolean);
      if (brandValues.length > 0) {
        params = params.append('brands', brandValues.join(','));
        console.log('🏷️ Brand filtresi eklendi:', brandValues.join(','));
      }
    }
    
    // Type filtreleme
    if (types && types.length > 0) {
      params = params.append('types', types.join(','));
      console.log('📝 Type filtresi eklendi:', types.join(','));
    }
    
    // Final URL'i logla
    const finalUrl = this.baseURL + 'Product' + (params.toString() ? '?' + params.toString() : '');
    console.log('🔗 Final URL:', finalUrl);
    
    return this.http.get<Product[]>(this.baseURL + 'Product', { params }).pipe(
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
        console.error('❌ Error URL:', error.url);
        return throwError(() => error);
      })
    );
  }

  getBrands(): void {
    if (this.brands.length > 0) return;
    
    this.http.get<Brand[]>(this.baseURL + 'brands').pipe(
      catchError(error => {
        console.error('❌ getBrands Error:', error);
        return throwError(() => error);
      })
    ).subscribe({
      next: response => {
        this.brands = response;
        console.log('✅ Brands yüklendi:', this.brands);
      },
      error: error => {
        console.error('❌ Brands yüklenemedi:', error);
      }
    });
  }

  getTypes(): void {
    if (this.types.length > 0) return;
    
    this.http.get<string[]>(this.baseURL + 'products/type').pipe(
      catchError(error => {
        console.error('❌ getTypes Error:', error);
        return throwError(() => error);
      })
    ).subscribe({
      next: response => {
        this.types = response;
        console.log('✅ Types yüklendi:', this.types);
      },
      error: error => {
        console.error('❌ Types yüklenemedi:', error);
      }
    });
  }
}