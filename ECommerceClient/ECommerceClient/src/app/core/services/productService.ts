import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { Product } from '../../shared/models/product';
import { Brand } from '../../shared/models/brands';
import { ShopParams } from '../../shared/models/productParam';
import { Pagination } from '../../shared/models/pagination';
import { environment } from '../../../environments/environment';
import { Category } from '../../shared/models/category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  baseURL = environment.apiUrl;
  private http = inject(HttpClient);

  // simple in-memory caches
  private brandsCache: Brand[] = [];
  private categoriesCache: Category[] = [];

  getProducts(shopParams: ShopParams): Observable<any> {
    let params = new HttpParams()
      .append('PageIndex', shopParams.pageNumber.toString())
      .append('pageNumber', shopParams.pageNumber.toString())
      .append('PageSize', shopParams.pageSize.toString())
      .append('pageSize', shopParams.pageSize.toString());

    if (shopParams.sort) params = params.append('sort', shopParams.sort);
    if (shopParams.search) params = params.append('search', shopParams.search);

    if (shopParams.brands && shopParams.brands.length) {
      shopParams.brands.forEach(b => params = params.append('Brands', b));
    }

    if (shopParams.categories && shopParams.categories.length) {
      shopParams.categories.forEach(c => params = params.append('Categories', c));
    }

    const url = this.baseURL + 'Product';
    return this.http.get<any>(url, { params }).pipe(
      tap(() => {}),
      catchError(err => {
        console.error('getProducts error', err);
        return throwError(() => err);
      })
    );
  }

  getProduct(id: string): Observable<Product> {
    return this.http.get<Product>(this.baseURL + 'Product/' + id).pipe(
      catchError(err => {
        console.error('getProduct error', err);
        return throwError(() => err);
      })
    );
  }

  getBrands(): Observable<Brand[]> {
    if (this.brandsCache.length) return of(this.brandsCache);

    return this.http.get<Brand[]>(this.baseURL + 'Brands').pipe(
      tap(brands => this.brandsCache = brands),
      catchError(err => {
        console.error('getBrands error', err);
        return throwError(() => err);
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
    return this.getProducts(merged);
  }

  getCategories(): Observable<Category[]> {
    if (this.categoriesCache.length) return of(this.categoriesCache);

    return this.http.get<Category[]>(this.baseURL + 'Category').pipe(
      tap(categories => this.categoriesCache = categories),
      catchError(err => {
        console.error('getCategories error', err);
        return throwError(() => err);
      })
    );
  }

  getFilteredProducts(filters: any): Observable<Pagination<Product>> {
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

  getCategoryWithSubcategories(categoryId: string): Observable<Category> {
    return this.http.get<Category>(this.baseURL + 'Category/' + categoryId).pipe(
      tap(category => {
        const idx = this.categoriesCache.findIndex(c => c.id === categoryId);
        if (idx !== -1) this.categoriesCache[idx] = { ...this.categoriesCache[idx], subCategories: category.subCategories };
      }),
      catchError(err => {
        console.error('getCategoryWithSubcategories error', err);
        return throwError(() => err);
      })
    );
  }

  getCategoryBrands(categoryId: string): Observable<Brand[]> {
    const category = this.categoriesCache.find(c => c.id === categoryId);
    if (category?.brands?.length) return of(category.brands);

    return this.http.get<any>(this.baseURL + 'Category/' + categoryId + '/brands').pipe(
      map(resp => resp.brands || []),
      tap(brands => { if (category) category.brands = brands; }),
      catchError(err => {
        console.error('getCategoryBrands error', err);
        return throwError(() => err);
      })
    );
  }

  getSubcategoryBrands(subcategoryId: string): Observable<Brand[]> {
    return this.http.get<Brand[]>(this.baseURL + 'Category/subcategory/' + subcategoryId + '/brands').pipe(
      catchError(err => {
        console.error('getSubcategoryBrands error', err);
        return throwError(() => err);
      })
    );
  }

  getCategoryByName(categoryName: string): Observable<Category> {
    return this.http.get<Category>(this.baseURL + 'Category/name/' + categoryName).pipe(
      catchError(err => {
        console.error('getCategoryByName error', err);
        return throwError(() => err);
      })
    );
  }

  /**
   * Prerendering için kullanılacak tüm ürün ID'lerini getirir
   */
  getProductIdsForPrerendering(): Observable<{id: string}[]> {
    return this.http.get<Product[]>(this.baseURL + 'Product/ids').pipe(
      map(products => products.map(product => ({ id: product.id }))),
      catchError(err => {
        console.error('getProductIdsForPrerendering error', err);
        return throwError(() => err);
      })
    );
  }

  /**
   * Prerendering için kullanılacak tüm kategori slug'larını getirir
   */
  getCategorySlugForPrerendering(): Observable<{slug: string}[]> {
    return this.http.get<Category[]>(this.baseURL + 'Category').pipe(
      map(categories => categories.map(category => ({ slug: category.name.toLowerCase() }))),
      catchError(err => {
        console.error('getCategorySlugForPrerendering error', err);
        return throwError(() => err);
      })
    );
  }

  /**
   * Prerendering için kullanılacak tüm sipariş ID'lerini getirir
   */
  getOrderIdsForPrerendering(): Observable<{id: string}[]> {
    return this.http.get<{id: string}[]>(this.baseURL + 'Order/ids').pipe(
      catchError(err => {
        console.error('getOrderIdsForPrerendering error', err);
        return throwError(() => err);
      })
    );
  }
}