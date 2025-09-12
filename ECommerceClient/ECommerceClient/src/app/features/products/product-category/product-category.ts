import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, switchMap, tap } from 'rxjs';
import { ProductService } from '../../../core/services/productService';
import { Product } from '../../../shared/models/product';
import { Pagination } from '../../../shared/models/pagination';
import { ShopParams } from '../../../shared/models/productParam';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { ProductItem } from "../product-item/product-item";
import { SidebarFilter } from "./sidebar-filter/sidebar-filter";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

@Component({
  selector: 'app-product-category',
  standalone: true,
  templateUrl: './product-category.html',
  styleUrls: ['./product-category.scss'],
  imports: [
    CommonModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatListModule,
    FormsModule,
    ProductItem,
    SidebarFilter,
    MatProgressSpinnerModule,
    InfiniteScrollModule
]
})
export class ProductCategory implements OnInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);

  slug = '';
  products: Product[] = []; 
  products$ = new BehaviorSubject<Product[]>([]);
  totalCount = 0;
  loading = false;
  noMoreProducts = false;
  loadingMore = false;

  shopParams: ShopParams = {
    brands: [],
    categories: [],
    sort: 'name',
    pageNumber: 1,
    pageSize: 9,
    search: ''
  };

  pageSizeOptions = [9, 18, 27, 36];

  sortOptions = [
    { name: 'Alfabetik (A-Z)', value: 'name' },
    { name: 'Alfabetik (Z-A)', value: 'nameDesc' },
    { name: 'Fiyat (Artan)', value: 'priceAsc' },
    { name: 'Fiyat (Azalan)', value: 'priceDesc' },
    { name: 'Yeni Eklenen', value: 'newest' }
  ];

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        tap(pm => {
          const newSlug = pm.get('slug') ?? '';
          if (newSlug !== this.slug) {
            this.slug = newSlug;
            this.shopParams = {
              brands: [],
              categories: [],
              sort: 'name',
              pageNumber: 1,
              pageSize: 9,
              search: ''
            }; 
            this.noMoreProducts = false;
            this.products$.next([]);
          }
        }),
        switchMap(() => this.fetchProducts())
      )
      .subscribe();
  }

  private mapResponse(res: any): Product[] {
    if (!res) return [];
    return res.data
      ?? res.items
      ?? res.result
      ?? res.products
      ?? (Array.isArray(res) ? res : []);
  }

  private resolveTotal(res: any): number {
    return res?.count
      ?? res?.totalCount
      ?? res?.total
      ?? res?.recordsTotal
      ?? (Array.isArray(res?.data) ? res.data.length : 0);
  }

  fetchProducts() {
    if (!this.slug) {
      this.products$.next([]);
      this.totalCount = 0;
      this.noMoreProducts = true; 
      return this.productService.getProductsByCategory('', this.shopParams);
    }
    
    this.loading = true;
    this.noMoreProducts = false; 
    
    return this.productService.getProductsByCategory(this.slug, this.shopParams).pipe(
      tap({
        next: (res: Pagination<Product> | any) => {
          const list = this.mapResponse(res);
          const total = this.resolveTotal(res);
          
          if (this.shopParams.pageNumber > 1 && !this.loading) {
            const currentProducts = this.products$.getValue() || [];
            this.products$.next([...currentProducts, ...list]);
          } else {
            this.products$.next(list);
          }
          
          this.totalCount = total;
          
          if (list.length < this.shopParams.pageSize) {
            this.noMoreProducts = true;
          }
          
          this.loading = false;
        },
        error: (err) => {
          console.error('fetchProducts error:', err);
          this.products$.next([]);
          this.totalCount = 0;
          this.loading = false;
          this.noMoreProducts = true;
        }
      })
    );
  }

  loadProducts() {
    if (this.loading) {
      return;
    }
    
    this.loading = true;
    
    this.productService.getProducts(this.shopParams).subscribe({
      next: (response) => {
        if (Array.isArray(response)) {
          if (response.length > 0) {
            const existingIds = new Set(this.products.map(p => p.id));
            const newProducts = response.filter(p => !existingIds.has(p.id));
            
            if (this.shopParams.pageNumber === 1) {
              this.products = [...response];
            } else if (newProducts.length > 0) {
              this.products = [...this.products, ...newProducts];
            }
            
            if (newProducts.length === 0 || response.length < this.shopParams.pageSize) {
              this.noMoreProducts = true;
            }
          } else {
            if (this.shopParams.pageNumber === 1) {
              this.products = [];
            }
            this.noMoreProducts = true;
          }
        }
        
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.loading = false;
      }
    });
  }
  
  handlePageEvent(e: PageEvent) {
    this.shopParams.pageNumber = e.pageIndex + 1;
    this.shopParams.pageSize = e.pageSize;
    this.fetchProducts().subscribe();
  }

  onSortChange(event: any) {
    const value = event.option?.value ?? event.value ?? '';
    if (value && value !== this.shopParams.sort) {
      this.shopParams.sort = value;
      this.shopParams.pageNumber = 1;
      this.fetchProducts().subscribe();
    }
  }

  openFiltersDialog() {
    this.router.navigate(['products/category', this.slug], { queryParams: { ...this.shopParams } });
  }

  onFilterChange(event: any) {
    if (event.brands) {
      this.shopParams.brands = event.brands;
      this.shopParams.pageNumber = 1;
      this.products$.next([]); 
      this.noMoreProducts = false;
      this.fetchProducts().subscribe();
    }
  }

  onScroll() {
    if (this.noMoreProducts || this.loadingMore || this.loading) {
      return;
    }
    
    this.loadingMore = true;
    this.shopParams.pageNumber++;
    
    this.productService.getProductsByCategory(this.slug, this.shopParams).subscribe({
      next: (response: any) => {
        const currentProducts = this.products$.getValue() || [];
        const newProducts = this.mapResponse(response);
        const existingIds = new Set(currentProducts.map(p => p.id));
        const uniqueNewProducts = newProducts.filter(p => !existingIds.has(p.id));
        
        if (uniqueNewProducts.length === 0 || newProducts.length < this.shopParams.pageSize) {
          this.noMoreProducts = true;
        }
        
        if (uniqueNewProducts.length > 0) {
          this.products$.next([...currentProducts, ...uniqueNewProducts]);
        }
        
        this.loadingMore = false;
      },
      error: (error) => {
        console.error('Error loading more products:', error);
        this.loadingMore = false;
      }
    });
  }
}