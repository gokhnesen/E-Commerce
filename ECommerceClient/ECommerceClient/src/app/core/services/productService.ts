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

getProducts(shopParams: ShopParams): Observable<any> {
  let params = new HttpParams();
  
  // Backend PageIndex ve PageSize kullanıyor
  params = params.append('PageIndex', shopParams.pageNumber.toString());
  params = params.append('PageSize', shopParams.pageSize.toString());
  
  if (shopParams.sort) {
    params = params.append('sort', shopParams.sort);
  }
  
  if (shopParams.search) {
    params = params.append('search', shopParams.search);
  }
  
  // Marka parametresi - Her bir marka için ayrı bir Brands parametresi ekle
  if (shopParams.brands && shopParams.brands.length > 0) {
    // ID yerine marka adını gönderme ihtimalini kontrol edin
    // Eğer brands dizisinde ID'ler yerine marka adları varsa:
    shopParams.brands.forEach(brand => {
      params = params.append('Brands', brand);
    });
    
    console.log('Gönderilen marka filtresi:', shopParams.brands);
  }
  
  // Kategori parametresi - Her bir kategori için ayrı bir Categories parametresi ekle
  if (shopParams.categories && shopParams.categories.length > 0) {
    shopParams.categories.forEach(category => {
      params = params.append('Categories', category);
    });
  }
  
  console.log('API isteği URL parametreleri:', params.toString());
  
  return this.http.get<any>(`${this.baseURL}product`, { params }).pipe(
    tap(response => {
      console.log('API Yanıtı:', response);
    }),
    catchError(error => {
      console.error('API Hatası:', error);
      return throwError(() => error);
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
    console.log('📂 getProductsByCategory', slug, current);
    
    // Kategoriye göre ShopParams oluştur
    const merged: ShopParams = {
      brands: current?.brands ?? [],
      categories: slug ? [slug] : [],
      sort: current?.sort ?? 'name',
      pageNumber: current?.pageNumber ?? 1,
      pageSize: current?.pageSize ?? 9,
      search: current?.search ?? ''
    };
    
    // Marka ID'leri yerine marka adları gönderiliyor olabilir
    // Eğer marka listesini kontrol etmeniz gerekiyorsa, burada yapabilirsiniz
    
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