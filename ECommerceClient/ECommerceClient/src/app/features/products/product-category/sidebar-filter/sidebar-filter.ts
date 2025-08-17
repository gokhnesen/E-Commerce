import { Component, DestroyRef, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
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
export class SidebarFilter implements OnInit {
  @Input() activeCategory: string = '';
  @Input() selectedBrands: string[] = []; // Add this input property
  @Output() filterChange = new EventEmitter<{brands: string[]}>();
  
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
        const slug = params['slug'];
        this.activeCategory = slug || '';
        
        if (slug) {
          this.loadCategoryWithSubcategories();
        } else {
          this.loadAllCategories();
        }
      });
      
    // Initialize brand selections from input
    this.updateBrandSelections();
  }
  
  // Watch for changes to selectedBrands input
  ngOnChanges() {
    // Completely reset the selectedBrandMap when selectedBrands changes
    this.selectedBrandMap = {};
    
    // For each category, clear the selectedBrands
    this.categories.forEach(category => {
      if (category.selectedBrands) {
        category.selectedBrands = [];
      }
    });
    
    // Then apply new selections from input
    this.updateBrandSelections();
  }
  
  // Method to update internal state when selectedBrands input changes
  private updateBrandSelections() {
    // Apply new selections from input (if any)
    if (this.selectedBrands && this.selectedBrands.length) {
      this.categories.forEach(category => {
        if (category.brands) {
          category.brands.forEach(brand => {
            if (this.selectedBrands.includes(brand.name)) {
              this.selectedBrandMap[brand.id] = true;
              
              if (!category.selectedBrands) {
                category.selectedBrands = [];
              }
              
              if (!category.selectedBrands.find(b => b.id === brand.id)) {
                category.selectedBrands.push(brand);
              }
            }
          });
        }
      });
    }
  }

  loadCategoryWithSubcategories(): void {
    this.isLoading = true;
    
    // Reset brand selections when loading new categories
    this.selectedBrandMap = {};
    
    this.productService.getCategoryByName(this.activeCategory).subscribe({
      next: (category) => {
        if (category.subCategories?.length) {
          this.categories = category.subCategories.map(sub => ({
            id: sub.id,
            name: sub.name,
            isExpanded: false
          } as Category));
          // Make sure updateBrandSelections is called AFTER brands are loaded
          this.categories.forEach(cat => this.loadCategoryBrands(cat));
          setTimeout(() => this.updateBrandSelections(), 100);
        } else {
          this.categories = [{
            id: category.id,
            name: category.name,
            isExpanded: false
          }];
          this.loadCategoryBrands(this.categories[0]);
        }
        this.isLoading = false;
      },
      error: () => this.loadAllCategories()
    });
  }

  loadAllCategories(): void {
    this.isLoading = true;
    
    this.productService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.expandActiveCategory();
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  loadCategoryBrands(category: Category): void {
    if (category.brands?.length) return;

    this.productService.getCategoryBrands(category.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(brands => {
        category.brands = brands;
        category.selectedBrands = [];
        
        if (this.selectedBrands && this.selectedBrands.length) {
          brands.forEach(brand => {
            if (this.selectedBrands.includes(brand.name)) {
              this.selectedBrandMap[brand.id] = true;
                if (!category.selectedBrands) {
                category.selectedBrands = [];
                }
                category.selectedBrands.push(brand);
            }
          });
        }
      });
  }

  expandActiveCategory(): void {
    if (!this.categories.length || !this.activeCategory) return;

    const category = this.categories.find(c => 
      c.name.toLowerCase() === this.activeCategory.toLowerCase());
    
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

  // Rename selectedBrands property to selectedBrandMap to avoid conflict
  toggleBrand(brand: Brand, category: Category): void {
    const brandKey = brand.id;
    this.selectedBrandMap[brandKey] = !this.selectedBrandMap[brandKey];
    
    if (!category.selectedBrands) {
      category.selectedBrands = [];
    }
    
    if (this.selectedBrandMap[brandKey]) {
      if (!category.selectedBrands.find(b => b.id === brand.id)) {
        category.selectedBrands.push(brand);
      }
    } else {
      category.selectedBrands = category.selectedBrands.filter(b => b.id !== brand.id);
    }
    
    this.updateFilters();
  }

  isBrandSelected(brand: Brand): boolean {
    return !!this.selectedBrandMap[brand.id];
  }

  updateFilters(): void {
    const selectedBrands = this.getSelectedBrands();
    const brandNames = selectedBrands.map(brand => brand.name);
    
    this.filterChange.emit({ brands: brandNames });
  }

  getSelectedBrands(): Brand[] {
    const selectedBrands: Brand[] = [];
    
    this.categories.forEach(category => {
      if (category.selectedBrands?.length) {
        selectedBrands.push(...category.selectedBrands);
      }
    });
    
    return selectedBrands;
  }
}

