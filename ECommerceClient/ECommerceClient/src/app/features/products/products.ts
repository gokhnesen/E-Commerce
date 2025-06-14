// products.component.ts
import { Component, inject } from '@angular/core';
import { ProductService } from '../../core/services/productService';
import { Product } from '../../shared/models/product';
import { MatCard, MatCardContent } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-products',
  imports: [
    MatCard,
    MatCardContent,
    CommonModule
  ],
  templateUrl: './products.html',
  styleUrl: './products.scss'
})
export class Products {
  private productService = inject(ProductService);
  
  // Observable olarak tanımla
  products$: Observable<Product[]>;

  constructor() {
    // Constructor'da Observable'ı ata
    this.products$ = this.productService.getProducts();
    
    
    this.products$.subscribe(data => {
      console.log('🎯 Async pipe - Veri geldi:', data);
      console.log('🎯 Async pipe - Veri sayısı:', data?.length);
    });
  }


}