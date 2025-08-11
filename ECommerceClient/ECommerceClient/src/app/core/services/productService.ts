import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, OnInit } from '@angular/core';
import { Observable, tap, catchError, throwError, of, map } from 'rxjs';
import { Product } from '../../shared/models/product';
import { Brand } from '../../shared/models/brands';
import { ShopParams } from '../../shared/models/productParam';
import { Pagination } from '../../shared/models/pagination';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  baseURL = environment.apiUrl;
  private http = inject(HttpClient);
  brands: Brand[] = [];
  route: any;
  shopParams: any;

  getProducts(shopParams: ShopParams): Observable<Pagination<Product>> {
    console.log('🚀 Service getProducts çağrıldı');
    console.log('📦 ShopParams:', shopParams);

    let params = new HttpParams();

    if (shopParams.brands?.length) {
      const brandNames = [...new Set(
        shopParams.brands
          .map(b => typeof b === 'object' && b && 'name' in b ? (b as any).name : b)
          .filter(Boolean) as string[]
      )];
      if (brandNames.length) {
        params = params.append('brands', brandNames.join(','));
      }
    }

    if (shopParams.categories?.length) {
       params = params.append('categories', shopParams.categories.join(','));
    }

    if (shopParams.sort?.trim()) {
      params = params.append('sort', shopParams.sort.trim());
    }

    if (shopParams.pageNumber > 0) {
      params = params.append('pageNumber', shopParams.pageNumber);
    }

    if (shopParams.pageSize > 0) {
      params = params.append('pageSize', shopParams.pageSize);
    }

    if (shopParams.search) {
      params = params.append('search', shopParams.search);
    }

    const finalUrl = this.baseURL + 'Product' + (params.toString() ? '?' + params.toString() : '');
    console.log('🔗 Final URL:', finalUrl);

    return this.http.get<Pagination<Product>>(this.baseURL + 'Product', { params }).pipe(
      tap(r => {
        console.log('✅ API Response RAW:', r);
        console.log('🧩 Keys:', Object.keys(r || {}));
      }),
      catchError(err => {
        console.error('❌ getProducts Error:', err);
        return throwError(() => err);
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
    
    this.http.get<Brand[]>(this.baseURL + 'Brands').pipe(
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

  getProductsByCategory(slug: string, current?: Partial<ShopParams>): Observable<Pagination<Product>> {
    const merged: ShopParams = {
      brands: current?.brands ?? [],
      categories: slug ? [slug] : [],
      sort: current?.sort ?? 'name',
      pageNumber: current?.pageNumber ?? 1,
      pageSize: current?.pageSize ?? 9,
      search: current?.search ?? ''
    };
    console.log('📂 getProductsByCategory', slug, merged);
    return this.getProducts(merged);
  }
  
  // Kategori bazlı markalar için yeni metot (mevcut servisi bozmadan ekleyin)
  getCategoryBrands(categorySlug: string): Observable<Brand[]> {
    console.log(`getCategoryBrands başladı - kategori: ${categorySlug}`);
    
    return this.getProductsByCategory(categorySlug, {pageSize: 100}).pipe(
      tap(response => console.log(`✅ ${categorySlug} ürünleri alındı:`, response)),
      map(response => {
        if (!response || !response.data || !Array.isArray(response.data)) {
          console.warn(`❌ ${categorySlug} için geçersiz ürün yanıtı`);
          return [];
        }
        
        // Benzersiz marka isimlerini bul
        const uniqueBrands = new Map<string, {count: number}>();
        
        response.data.forEach(product => {
          if (product.brand) {
            if (uniqueBrands.has(product.brand)) {  
              uniqueBrands.get(product.brand)!.count++;
            } else {
              uniqueBrands.set(product.brand, { count: 1 });
            }
          }
        });
        
        // Markalar dizisini oluştur ve ID değerlerini string'e dönüştür
        const brandList: Brand[] = Array.from(uniqueBrands.entries()).map(([name, data], index) => {
          return {
            id: (index + 1).toString(), // Number yerine string kullanın
            name: name,
            description: '',
            pictureUrl: ''
          };
        });
        
        console.log(`✅ ${categorySlug} kategorisi markaları:`, brandList);
        return brandList;
      }),
      catchError(err => {
        console.error(`❌ ${categorySlug} için markalar alınamadı:`, err);
        return of([]);
      })
    );
  }
  
}