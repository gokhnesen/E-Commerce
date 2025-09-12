// products.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { ProductService } from '../../core/services/productService';
import { Product } from '../../shared/models/product';
import { CommonModule } from '@angular/common';
import { ProductItem } from "./product-item/product-item";
import { MatDialog} from '@angular/material/dialog';
import { FiltersDialog } from './filters-dialog/filters-dialog';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatListOption, MatSelectionList, MatSelectionListChange } from '@angular/material/list';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { ShopParams } from '../../shared/models/productParam';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    ProductItem,
    MatButton,
    MatIcon,
    MatMenu,
    MatSelectionList,
    MatListOption,
    MatMenuTrigger,
    MatPaginator,
    FormsModule,
    InfiniteScrollModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './products.html',
  styleUrl: './products.scss'
})
export class Products implements OnInit {
  private productService = inject(ProductService);
  private dialogService = inject(MatDialog);
  private route = inject(ActivatedRoute);
  
  products: Product[] = [];
  loading = false;
  noMoreProducts = false;
  
  sortOptions = [
    {name: 'Alfabetik', value: 'name'},
    {name: 'Fiyat: Artan', value: 'priceAsc'},
    {name: 'Fiyat: Azalan', value: 'priceDesc'},
  ];
  
  totalCount = 0;
  shopParams = new ShopParams();
  
  private isLoading = false; 

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.shopParams.search = params['search'] || '';
      this.initializeProduct();
    });
  }

  initializeProduct() {
    this.productService.getBrands();
    this.loadProducts();
  }

  loadProducts() {
    if (this.isLoading || this.loading) {
      return;
    }
    
    this.loading = true;
    this.isLoading = true;
    
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
            
            if (newProducts.length === 0 && this.shopParams.pageNumber > 1) {
              this.noMoreProducts = true;
            } else if (response.length < this.shopParams.pageSize) {
              this.noMoreProducts = true;
            }
            
            if (response.length === this.shopParams.pageSize) {
              this.totalCount = Math.max(this.products.length, this.shopParams.pageNumber * this.shopParams.pageSize);
            } else {
              this.totalCount = (this.shopParams.pageNumber - 1) * this.shopParams.pageSize + response.length;
            }
            
          } else {
            if (this.shopParams.pageNumber === 1) {
              this.products = [];
            }
            this.noMoreProducts = true;
          }
        }
        
        this.loading = false;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.loading = false;
        this.isLoading = false;
      }
    });
  }

  onSearchChange() {
    this.shopParams.pageNumber = 1;
    this.loadProducts();
  }

  handlePageEvent(event: PageEvent) {
    this.shopParams.pageNumber = event.pageIndex + 1;
    this.shopParams.pageSize = event.pageSize;
    this.loadProducts();
  }

  onSortChange(event: MatSelectionListChange) {
    const selectedOption = event.options[0];
    if (selectedOption) {
      this.shopParams.sort = selectedOption.value;
      this.shopParams.pageNumber = 1;
      console.log('Sıralama değişti:', this.shopParams.sort);
      this.products = [];
      this.loadProducts();
    }
  }

  openFiltersDialog() {
    const dialogRef = this.dialogService.open(FiltersDialog, {
      minWidth: '500px',
      data: {
        selectedBrands: this.shopParams.brands,
        selectedTypes: this.shopParams.categories
      }
    });
    
    dialogRef.afterClosed().subscribe({
      next: result => {
        if (result) {
          console.log('Filtre sonucu:', result);
          this.shopParams.brands = result.selectedBrands;
          this.shopParams.categories = result.selectedTypes;
          this.shopParams.pageNumber = 1;
          this.products = []; // Ürünleri temizle
          this.loadProducts();
        }
      }
    });
  }
  
  onScroll() {
    // Eğer tüm ürünler yüklendiyse veya zaten yükleme yapılıyorsa, işlem yapma
    if (this.noMoreProducts || this.loading || this.isLoading) {
      console.log('Kaydırma işlemi atlandı:', 
        this.noMoreProducts ? 'Tüm ürünler görüntülendi' : 'Yükleme zaten devam ediyor');
      return;
    }
    
    // Şu anki sayfa numarasını ve ürün sayısını logla
    console.log(`Sayfa kaydırıldı, yeni sayfa: ${this.shopParams.pageNumber + 1}, mevcut ürün sayısı: ${this.products.length}`);
    
    // Sonraki sayfayı yükle
    this.shopParams.pageNumber++;
    this.loadProducts();
  }
}