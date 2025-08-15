import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, OnInit } from '@angular/core';
import { Observable, tap, catchError, throwError, of, map } from 'rxjs';
import { Product } from '../../shared/models/product';
import { Brand } from '../../shared/models/brands';
import { ShopParams } from '../../shared/models/productParam';
import { Pagination } from '../../shared/models/pagination';
import { environment } from '../../../environments/environment';
import { Category, SubCategory } from '../../shared/models/category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  baseURL = environment.apiUrl;
  private http = inject(HttpClient);
  brands: Brand[] = [];
  categories: Category[] = [];
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

  getBrands(): Observable<Brand[]> {
    console.log('🔍 getBrands çağrıldı');
    return this.http.get<Brand[]>(this.baseURL + 'Brands').pipe(
      tap(brands => {
        this.brands = brands;
        console.log('✅ Brands yüklendi:', brands);
      }),
      catchError(error => {
        console.error('❌ getBrands Error:', error);
        return throwError(() => error);
      })
    );
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

  // Sidebar filter için yeni metodlar
  getCategories(): Observable<Category[]> {
    console.log('🔍 getCategories çağrıldı');
    
    if (this.categories.length > 0) {
      console.log('✅ Cached kategoriler kullanılıyor:', this.categories);
      return of(this.categories);
    }
    
    return this.http.get<Category[]>(this.baseURL + 'Category').pipe(
      tap(categories => {
        this.categories = categories;
        console.log('✅ Kategoriler yüklendi:', categories);
      }),
      catchError(error => {
        console.error('❌ getCategories Error:', error);
        return throwError(() => error);
      })
    );
  }

  getFilteredProducts(filters: any): Observable<Pagination<Product>> {
    console.log('🔍 getFilteredProducts çağrıldı, filters:', filters);
    
    const shopParams: ShopParams = {
      brands: filters.brands || [],
      categories: filters.categories || [],
      sort: 'name',
      pageNumber: 1,
      pageSize: 9,
      search: ''
    };
    
    return this.getProducts(shopParams);
  }


// product.service.ts
getCategoryWithSubcategories(categoryId: string): Observable<Category> {
  console.log('🔍 getCategoryWithSubcategories çağrıldı, categoryId:', categoryId);
  
  const finalUrl = `${this.baseURL}Category/${categoryId}`;
  console.log('🔗 Final URL:', finalUrl);
  
  return this.http.get<Category>(finalUrl).pipe(
    tap(category => {
      console.log('✅ Kategori ve alt kategorileri yüklendi:', category);
      
      // Update the cached category with subcategories if it exists
      const existingCategoryIndex = this.categories.findIndex(c => c.id === categoryId);
      if (existingCategoryIndex !== -1) {
        this.categories[existingCategoryIndex] = {
          ...this.categories[existingCategoryIndex],
          subCategories: category.subCategories
        };
      }
    }),
    catchError(error => {
      console.error(`❌ getCategoryWithSubcategories Error for ID ${categoryId}:`, error);
      return throwError(() => error);
    })
  );
}

getCategoryBrands(categoryId: string): Observable<Brand[]> {
  console.log('🔍 getCategoryBrands çağrıldı, categoryId:', categoryId);
  
  const category = this.categories.find(c => c.id === categoryId);
  if (category?.brands?.length) {
    console.log('✅ Cached brands kullanılıyor:', category.brands);
    return of(category.brands);
  }
  
  const finalUrl = `${this.baseURL}Category/${categoryId}/brands`;
  console.log('🔗 Final URL:', finalUrl);
  
  return this.http.get<any>(finalUrl).pipe(
    map(response => response.brands || []),
    tap(brands => {
      if (category) {
        category.brands = brands;
      }
    }),
    catchError(error => {
      console.error(`❌ getCategoryBrands Error for ID ${categoryId}:`, error);
      return throwError(() => error);
    })
  );
}

getSubcategoryBrands(subcategoryId: string): Observable<Brand[]> {
  console.log('🔍 getSubcategoryBrands çağrıldı, subcategoryId:', subcategoryId);
  
  const finalUrl = `${this.baseURL}Category/subcategory/${subcategoryId}/brands`;
  console.log('🔗 Final URL:', finalUrl);
  
  return this.http.get<Brand[]>(finalUrl).pipe(
    tap(brands => {
      console.log('✅ Alt kategori markaları yüklendi:', brands);
    }),
    catchError(error => {
      console.error(`❌ getSubcategoryBrands Error for ID ${subcategoryId}:`, error);
      return throwError(() => error);
    })
  );
}

getCategoryByName(categoryName: string): Observable<Category> {
  const finalUrl = `${this.baseURL}Category/name/${categoryName}`;
  console.log('🔗 GetCategoryByName URL:', finalUrl);
  
  return this.http.get<Category>(finalUrl).pipe(
    tap(category => {
      console.log('✅ Kategori ve alt kategorileri yüklendi:', category);
    }),
    catchError(error => {
      console.error(`❌ getCategoryByName Error for name ${categoryName}:`, error);
      return throwError(() => error);
    })
  );
}
}