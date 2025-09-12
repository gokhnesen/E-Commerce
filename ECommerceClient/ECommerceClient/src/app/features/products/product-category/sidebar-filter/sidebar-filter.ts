import { Component, DestroyRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Brand } from '../../../../shared/models/brands';
import { Category } from '../../../../shared/models/category';
import { ProductService } from '../../../../core/services/productService';

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
export class SidebarFilter implements OnInit, OnChanges {
  @Input() activeCategory = '';
  @Input() selectedBrands: string[] = [];
  @Output() filterChange = new EventEmitter<{ brands: string[] }>();

  private destroyRef = inject(DestroyRef);
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);

  categories: Category[] = [];
  isLoading = true;
  selectedBrandMap: Record<string, boolean> = {};

  ngOnInit(): void {
    this.route.params
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => {
        const slug = params['slug'] ?? '';
        this.activeCategory = slug;
        if (slug) {
          this.loadCategoryWithSubcategories();
        } else {
          this.loadAllCategories();
        }
      });

    this.applySelectedBrands();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedBrands']) {
      this.applySelectedBrands();
    }
  }

  private applySelectedBrands(): void {
    this.selectedBrandMap = {};
    if (!this.selectedBrands?.length || !this.categories?.length) return;

    for (const category of this.categories) {
      category.selectedBrands = [];
      if (!category.brands) continue;

      for (const brand of category.brands) {
        if (this.selectedBrands.includes(brand.name)) {
          this.selectedBrandMap[brand.id] = true;
          category.selectedBrands.push(brand);
        }
      }
    }
  }

  loadCategoryWithSubcategories(): void {
    this.isLoading = true;
    this.selectedBrandMap = {};

    this.productService.getCategoryByName(this.activeCategory).subscribe({
      next: category => {
        if (category.subCategories?.length) {
          this.categories = category.subCategories.map(sub => ({
            id: sub.id,
            name: sub.name,
            isExpanded: false
          } as Category));

          // load brands for each subcategory
          for (const cat of this.categories) {
            this.loadCategoryBrands(cat);
          }
        } else {
          this.categories = [{
            id: category.id,
            name: category.name,
            isExpanded: false
          }];
          this.loadCategoryBrands(this.categories[0]);
        }
        this.isLoading = false;
        this.applySelectedBrands();
      },
      error: () => {
        this.loadAllCategories();
      }
    });
  }

  loadAllCategories(): void {
    this.isLoading = true;
    this.productService.getCategories().subscribe({
      next: categories => {
        this.categories = categories;
        this.expandActiveCategory();
        this.isLoading = false;
        this.applySelectedBrands();
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  loadCategoryBrands(category: Category): void {
    if (category.brands?.length) return;

    this.productService.getCategoryBrands(category.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(brands => {
        category.brands = brands;
        category.selectedBrands = [];

        if (this.selectedBrands?.length) {
          for (const brand of brands) {
            if (this.selectedBrands.includes(brand.name)) {
              this.selectedBrandMap[brand.id] = true;
              category.selectedBrands.push(brand);
            }
          }
        }
      });
  }

  expandActiveCategory(): void {
    if (!this.categories.length || !this.activeCategory) return;
    const category = this.categories.find(c => c.name.toLowerCase() === this.activeCategory.toLowerCase());
    if (category) {
      category.isExpanded = true;
      this.loadCategoryBrands(category);
    }
  }

  toggleCategory(category: Category): void {
    category.isExpanded = !category.isExpanded;
    if (category.isExpanded && !category.brands) {
      this.loadCategoryBrands(category);
    }
  }

  toggleBrand(brand: Brand, category: Category): void {
    const key = brand.id;
    this.selectedBrandMap[key] = !this.selectedBrandMap[key];

    category.selectedBrands = category.selectedBrands ?? [];
    if (this.selectedBrandMap[key]) {
      if (!category.selectedBrands.find(b => b.id === brand.id)) {
        category.selectedBrands.push(brand);
      }
    } else {
      category.selectedBrands = category.selectedBrands.filter(b => b.id !== brand.id);
    }

    this.emitFilters();
  }

  isBrandSelected(brand: Brand): boolean {
    return !!this.selectedBrandMap[brand.id];
  }

  private emitFilters(): void {
    const names = this.getSelectedBrands().map(b => b.name);
    this.filterChange.emit({ brands: names });
  }

  getSelectedBrands(): Brand[] {
    const selected: Brand[] = [];
    for (const category of this.categories) {
      if (category.selectedBrands?.length) {
        selected.push(...category.selectedBrands);
      }
    }
    return selected;
  }
}

