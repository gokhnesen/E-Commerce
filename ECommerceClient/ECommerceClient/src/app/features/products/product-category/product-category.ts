import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, switchMap, tap } from 'rxjs';
import { ProductService } from '../../../core/services/productService';
import { Product } from '../../../shared/models/product';
import { Pagination } from '../../../shared/models/pagination';
import { ShopParams } from '../../../shared/models/productParam';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { ProductItem } from "../product-item/product-item";

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
    ProductItem
]
})
export class ProductCategory implements OnInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);
  private destroyRef = inject(DestroyRef);

  slug = '';
  products$ = new BehaviorSubject<Product[]>([]);
  totalCount = 0;

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

  loading = false;

    ngOnInit(): void {
    this.route.paramMap
      .pipe(
        tap(pm => {
          const newSlug = pm.get('slug') ?? '';
          if (newSlug !== this.slug) {
            this.slug = newSlug;
            this.shopParams.pageNumber = 1;
          }
        }),
        switchMap(() => this.fetchProducts())
      )
      .subscribe();
  }

  private mapResponse(res: any): Product[] {
    if (!res) return [];
    // Olası alan adları sırayla denenir
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
      return this.productService.getProductsByCategory('', this.shopParams);
    }
    this.loading = true;
    return this.productService.getProductsByCategory(this.slug, this.shopParams).pipe(
      tap({
        next: (res: Pagination<Product> | any) => {
          console.log('🛠 map before ->', res);
            const list = this.mapResponse(res);
            const total = this.resolveTotal(res);
            console.log('📦 mapped list length:', list.length, 'total:', total);
            this.products$.next(list);
            this.totalCount = total;
            this.loading = false;
        },
        error: (err) => {
          console.error('❌ fetchProducts error:', err);
          this.products$.next([]);
          this.totalCount = 0;
          this.loading = false;
        }
      })
    );
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
}