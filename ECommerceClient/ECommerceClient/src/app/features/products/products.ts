// products.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { ProductService } from '../../core/services/productService';
import { Product } from '../../shared/models/product';
import { MatCard, MatCardContent } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { ProductItem } from "./product-item/product-item";

@Component({
  selector: 'app-products',
  imports: [
    CommonModule,
    ProductItem
],
  templateUrl: './products.html',
  styleUrl: './products.scss'
})
export class Products implements OnInit {
  private productService = inject(ProductService);
  
  products$: Observable<Product[]>;

  constructor() {
    this.products$ = this.productService.getProducts();
    this.products$.subscribe(data => {
      console.log('🎯 Async pipe - Veri geldi:', data);
      console.log('🎯 Async pipe - Veri sayısı:', data?.length);
    });

  }

  ngOnInit(): void {
    this.initializeProduct();
  }

      initializeProduct() {
      this.productService.getBrands();
      this.productService.getTypes();
    }
}