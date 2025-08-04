import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { Product } from '../../shared/models/product';
import { Brand } from '../../shared/models/brands';
import { ShopParams } from '../../shared/models/productParam';
import { Pagination } from '../../shared/models/pagination';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  baseURL = 'https://localhost:7091/api/';
  private http = inject(HttpClient);
  types: string[] = [];
  brands: Brand[] = [];

  getProducts(shopParams: ShopParams): Observable<Pagination<Product>> {
    console.log('🚀 Service getProducts çağrıldı');
    console.log('🌐 API URL:', this.baseURL + 'Product');
    console.log('📦 ShopParams:', shopParams);
    
    let params = new HttpParams();
    
    if (shopParams.brands && shopParams.brands.length > 0) {
      const brandNames = shopParams.brands
        .map(brand => {
          if (typeof brand === 'object' && brand !== null && 'name' in brand) {
            return (brand as any).name;
          }
          if (typeof brand === 'string') {
            return brand;
          }
          return null;
        })
        .filter(Boolean); 
      
      if (brandNames.length > 0) {
        params = params.append('brands', brandNames.join(','));
        console.log('🏷️ Brand filtresi eklendi:', brandNames);
        console.log('🏷️ Brand string:', brandNames.join(','));
      }
    }
    

    if (shopParams.categories && shopParams.categories.length > 0) {
      params = params.append('categories', shopParams.categories.join(','));
      console.log('📝 Category filtresi eklendi:', shopParams.categories.join(','));
    }
    
    if (shopParams.sort && shopParams.sort.trim() !== '') {
      params = params.append('Sort', shopParams.sort.trim());
      console.log('🔄 Sort filtresi eklendi:', shopParams.sort);
    }
    
    if (shopParams.pageNumber > 0) {
      params = params.append('pageNumber', shopParams.pageNumber.toString());
      console.log('📄 Page Number:', shopParams.pageNumber);
    }
    
    if (shopParams.pageSize > 0) {
      params = params.append('pageSize', shopParams.pageSize.toString());
      console.log('📊 Page Size:', shopParams.pageSize);
    }
    if(shopParams.search){
      params = params.append('search',shopParams.search)
    }
    
    const finalUrl = this.baseURL + 'Product' + (params.toString() ? '?' + params.toString() : '');
    console.log('🔗 Final URL:', finalUrl);
    
    return this.http.get<Pagination<Product>>(this.baseURL + 'Product', { params }).pipe(
      tap(response => console.log('✅ API Response:', response)),
      catchError(error => {
        console.error('❌ getProducts Error:', error);
        return throwError(() => error);
      })
    );
  }


getProduct(id: string): Observable<Product> {
  const finalUrl = `${this.baseURL}Product/${id}`;
  console.log('🔗 Final URL:', finalUrl);
  return this.http.get<Product>(finalUrl);
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