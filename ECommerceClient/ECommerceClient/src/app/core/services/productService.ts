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

 getProducts(brands?: Brand[], types?: string[], brandName?: string): Observable<Product[]> {
  console.log('🚀 Service getProducts çağrıldı');
  console.log('🌐 API URL:', this.baseURL + 'Product');
  
  let params = new HttpParams();
  
  if (brands && brands.length > 0) {
    const brandValues = brands.map(brand => brand.id || brand.name).filter(Boolean);
    if (brandValues.length > 0) {
      params = params.append('brand', brandValues.join(','));
      console.log('🏷️ Brand filtresi eklendi:', brandValues.join(','));
    }
  }
  
  if (brandName && brandName.trim() !== '') {
    params = params.append('brandName', brandName.trim());
    console.log('🏷️ BrandName filtresi eklendi:', brandName);
  }
  

  if (types && types.length > 0) {
    params = params.append('types', types.join(','));
    console.log('📝 Type filtresi eklendi:', types.join(','));
  }
  

  const finalUrl = this.baseURL + 'Product' + (params.toString() ? '?' + params.toString() : '');
  console.log('🔗 Final URL:', finalUrl);
  
  return this.http.get<Product[]>(this.baseURL + 'Product', { params }).pipe(
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