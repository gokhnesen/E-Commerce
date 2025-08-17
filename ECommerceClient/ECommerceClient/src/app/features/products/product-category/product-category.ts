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
import { Brand } from '../../../shared/models/brands';

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
  products: Product[] = []; // Array yerine observable kullanıyoruz
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
          // Yeni bir kategoriye geçiş yapıldığında tüm değişkenleri sıfırla
          this.slug = newSlug;
          this.shopParams = {
            brands: [],
            categories: [],
            sort: 'name',
            pageNumber: 1,
            pageSize: 9,
            search: ''
          }; // Reset all filters completely when changing categories
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
      this.noMoreProducts = true; // Kategori yoksa daha fazla ürün yok
      return this.productService.getProductsByCategory('', this.shopParams);
    }
    
    this.loading = true;
    this.noMoreProducts = false; // Her yeni yüklemede sıfırla
    
    return this.productService.getProductsByCategory(this.slug, this.shopParams).pipe(
      tap({
        next: (res: Pagination<Product> | any) => {
          console.log('🛠 API yanıtı:', res);
          const list = this.mapResponse(res);
          const total = this.resolveTotal(res);
          console.log('📦 Ürün sayısı:', list.length, 'Toplam:', total);
          
          // Sayfa 1'den büyükse ve sonsuz kaydırma için kullanılıyorsa, ürünleri ekle
          if (this.shopParams.pageNumber > 1 && !this.loading) {
            const currentProducts = this.products$.getValue() || [];
            this.products$.next([...currentProducts, ...list]);
          } else {
            // İlk yükleme veya filtre değişikliği için ürünleri sıfırla
            this.products$.next(list);
          }
          
          this.totalCount = total;
          
          // Daha fazla ürün olup olmadığını kontrol et
          if (list.length < this.shopParams.pageSize) {
            this.noMoreProducts = true;
            console.log('Tüm ürünler yüklendi (son sayfada az ürün var)');
          }
          
          this.loading = false;
        },
        error: (err) => {
          console.error('❌ fetchProducts error:', err);
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
          // Gelen verileri kontrol et
          if (response.length > 0) {
            // IDs of existing products
            const existingIds = new Set(this.products.map(p => p.id));
            
            // Sadece yeni ürünleri ekle (tekrarlayanları filtrele)
            const newProducts = response.filter(p => !existingIds.has(p.id));
            
            if (this.shopParams.pageNumber === 1) {
              // İlk sayfa ise, önceki ürünleri temizle
              this.products = [...response];
            } else if (newProducts.length > 0) {
              // Diğer sayfalarda, sadece yeni ürünleri ekle
              this.products = [...this.products, ...newProducts];
            }
            
            // Eğer hiç yeni ürün gelmediyse veya beklenen sayıdan az ürün geldiyse, tüm ürünler yüklenmiştir
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
        console.error('Ürünler yüklenirken hata:', error);
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
    // ...existing code...

onFilterChange(event: any) {
  console.log('Filtre değişikliği:', event);
  
  if (event.brands) {
    // Gelen veri doğrudan ID'ler olmalı
    this.shopParams.brands = event.brands;
    console.log('Filtrelenecek marka ID\'leri:', this.shopParams.brands);
    
    // Sayfalama ve ürünleri sıfırla
    this.shopParams.pageNumber = 1;
    this.products$.next([]); // BehaviorSubject kullanıyorsanız
    this.noMoreProducts = false;
    
    // Yeni filtrelere göre yükle
    this.fetchProducts().subscribe();
  }
}

// onScroll metodunu düzelt - getProducts yerine getProductsByCategory kullan
onScroll() {
  // Eğer daha fazla ürün yoksa veya zaten yükleme yapıyorsa, işlem yapma
  if (this.noMoreProducts || this.loadingMore || this.loading) {
    console.log('Kaydırma işlemi atlandı:', 
      this.noMoreProducts ? 'Tüm ürünler görüntülendi' : 'Yükleme zaten devam ediyor');
    return;
  }
  
  console.log(`Sayfa kaydırıldı, yeni sayfa: ${this.shopParams.pageNumber + 1}`);
  this.loadingMore = true;
  
  // Sayfa numarasını artır
  this.shopParams.pageNumber++;
  
  // Yeni sayfadaki ürünleri yükle - doğru metodu kullan
  this.productService.getProductsByCategory(this.slug, this.shopParams).subscribe({
    next: (response: any) => {
      // Mevcut ürünleri al
      const currentProducts = this.products$.getValue() || [];
      
      // Yeni ürünleri map et
      const newProducts = this.mapResponse(response);
      
      // Tekrar eden ürünleri filtrele
      const existingIds = new Set(currentProducts.map(p => p.id));
      const uniqueNewProducts = newProducts.filter(p => !existingIds.has(p.id));
      
      console.log('Yeni ürünler:', uniqueNewProducts.length, 'Toplam gelen:', newProducts.length);
      
      // Yeni ürün yoksa veya beklenen sayıdan az ürün geldiyse, daha fazla ürün olmadığını işaretle
      if (uniqueNewProducts.length === 0 || newProducts.length < this.shopParams.pageSize) {
        this.noMoreProducts = true;
        console.log('Tüm ürünler yüklendi, başka ürün kalmadı.');
      }
      
      // Yeni ürünleri mevcut ürünlere ekle
      if (uniqueNewProducts.length > 0) {
        this.products$.next([...currentProducts, ...uniqueNewProducts]);
      }
      
      this.loadingMore = false;
    },
    error: (error) => {
      console.error('Daha fazla ürün yüklenirken hata:', error);
      this.loadingMore = false;
    }
  });
}
}