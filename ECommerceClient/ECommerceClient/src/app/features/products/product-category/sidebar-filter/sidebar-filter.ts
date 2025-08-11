import { Component, DestroyRef, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { Brand } from '../../../../shared/models/brands';
import { ProductService } from '../../../../core/services/productService';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-sidebar-filter',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatIconModule,
    MatCheckboxModule,
    MatButtonModule
  ],
  templateUrl: './sidebar-filter.html',
  styleUrls: ['./sidebar-filter.scss']
})
export class SidebarFilter implements OnInit {
  private productService = inject(ProductService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  @Input() currentCategory: string = '';
  @Output() filterChange = new EventEmitter<any>();

  // Başlangıçta tüm kategorileri açık tut
  expandedCategories: Set<string> = new Set(['elektronik', 'bilgisayar', 'telefon', 'konsol']);
  selectedBrands: string[] = [];
  priceRange = { min: null as number | null, max: null as number | null };
  
  // Kategori-marka eşleştirmesi
  categoryBrands: {[key: string]: Brand[]} = {
    'bilgisayar': [],
    'telefon': [],
    'konsol': []
  };
  
  // Markaların ürün sayıları
  brandCounts: Record<string, number> = {};
  
  loading = {
    bilgisayar: false,
    telefon: false,
    konsol: false
  };

  ngOnInit() {
    console.log('SidebarFilter ngOnInit başladı');
    
    // URL'den mevcut kategori ve filtreleri al
    this.route.params.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(params => {
      if (params['slug']) {
        this.currentCategory = params['slug'];
        console.log('Kategori slug:', this.currentCategory);
        
        // İlgili kategorinin markalarını yükle
        if (['bilgisayar', 'telefon', 'konsol'].includes(this.currentCategory)) {
          this.loadBrandsForCategory(this.currentCategory);
        }
      }
    });

    this.route.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(params => {
      // URL'deki query parametrelerinden seçili markaları ayarla
      if (params['brands']) {
        this.selectedBrands = params['brands'].split(',');
      } else {
        this.selectedBrands = [];
      }
      
      // Fiyat aralığı
      if (params['minPrice']) this.priceRange.min = Number(params['minPrice']);
      if (params['maxPrice']) this.priceRange.max = Number(params['maxPrice']);
    });
    
    // İlk açılışta bilgisayar kategorisi markalarını mutlaka yükle
    this.loadBrandsForCategory('bilgisayar');
    console.log('İlk açılışta bilgisayar markaları yükleniyor');
  }

  loadBrandsForCategory(category: string): void {
    console.log(`${category} kategorisi için markalar yükleniyor...`);
    
    if (this.loading[category as keyof typeof this.loading]) {
      console.log(`${category} markaları zaten yükleniyor, bekleyiniz.`);
      return;
    }
    
    this.loading[category as keyof typeof this.loading] = true;
    
    // API'den markaları çek
    this.productService.getCategoryBrands(category).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (brands) => {
        console.log(`✅ ${category} markaları yüklendi:`, brands);
        this.categoryBrands[category] = brands;
        
        // Marka sayılarını güncelle
        brands.forEach(brand => {
          this.brandCounts[brand.name] = 1; // Varsayılan değer
        });
        
        this.loading[category as keyof typeof this.loading] = false;
      },
      error: (err) => {
        console.error(`❌ ${category} markaları yüklenemedi:`, err);
        this.loading[category as keyof typeof this.loading] = false;
      }
    });
  }

  isExpanded(category: string): boolean {
    return this.expandedCategories.has(category);
  }

  toggleCategory(category: string): void {
    if (this.expandedCategories.has(category)) {
      this.expandedCategories.delete(category);
    } else {
      this.expandedCategories.add(category);
    }
    console.log(`${category} kategori durumu: ${this.isExpanded(category)}`);
  }

  toggleSubcategory(category: string): void {
    if (this.expandedCategories.has(category)) {
      this.expandedCategories.delete(category);
    } else {
      this.expandedCategories.add(category);
      // Markaları henüz yüklenmediyse yükle
      if (this.categoryBrands[category]?.length === 0) {
        this.loadBrandsForCategory(category);
      }
    }
    console.log(`${category} alt kategori durumu: ${this.isExpanded(category)}`);
  }

  isActiveCategory(category: string): boolean {
    return this.currentCategory === category;
  }

  // Kategori bazlı marka listeleri
  getBilgisayarBrands(): Brand[] {
    const brands = this.categoryBrands['bilgisayar'] || [];
    console.log('Bilgisayar markaları:', brands);
    return brands;
  }
  
  getTelefonBrands(): Brand[] {
    return this.categoryBrands['telefon'] || [];
  }
  
  getKonsolBrands(): Brand[] {
    return this.categoryBrands['konsol'] || [];
  }

  // Bir markanın seçili olup olmadığını kontrol et
  isSelectedBrand(brandName: string): boolean {
    return this.selectedBrands.includes(brandName);
  }

  // Marka için ürün sayısını getir
  getBrandCount(brandName: string): number {
    return this.brandCounts[brandName] || 0;
  }

  // Marka seçimini değiştir
  toggleBrand(brandName: string, category: string): void {
    const index = this.selectedBrands.indexOf(brandName);
    if (index === -1) {
      this.selectedBrands.push(brandName);
    } else {
      this.selectedBrands.splice(index, 1);
    }
    this.applyFilters(category);
  }

  applyPriceFilter(): void {
    this.applyFilters(this.currentCategory);
  }

  hasActiveFilters(): boolean {
    return this.selectedBrands.length > 0 || 
           this.priceRange.min !== null || 
           this.priceRange.max !== null;
  }

  clearAllFilters(): void {
    this.selectedBrands = [];
    this.priceRange = { min: null, max: null };
    this.applyFilters(this.currentCategory);
  }

  private applyFilters(category: string): void {
    // Query parametrelerini oluştur
    const queryParams: any = {};
    
    // Seçili marka varsa ekle
    if (this.selectedBrands.length > 0) {
      queryParams.brands = this.selectedBrands.join(',');
    }
    
    // Fiyat aralığı
    if (this.priceRange.min !== null) {
      queryParams.minPrice = this.priceRange.min;
    }
    if (this.priceRange.max !== null) {
      queryParams.maxPrice = this.priceRange.max;
    }
    
    // Filtrelerle birlikte sayfayı yenile
    this.router.navigate(['/products/category', category || this.currentCategory], {
      queryParams,
      queryParamsHandling: 'merge'
    });
    
    // Parent bileşene bildir
    this.filterChange.emit({
      category,
      brands: this.selectedBrands,
      priceRange: this.priceRange
    });
  }
}
