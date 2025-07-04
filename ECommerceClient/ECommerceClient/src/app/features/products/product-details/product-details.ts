import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ProductService } from '../../../core/services/productService';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../../shared/models/product';
import { error } from 'console';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatDivider } from '@angular/material/divider';


@Component({
  selector: 'app-product-details',
  imports: [
    CommonModule,
    CurrencyPipe,
    MatIcon,
    MatButton,
    MatInput,
    MatFormField,
    MatLabel,
    MatDivider
  ],
  templateUrl: './product-details.html',
  styleUrl: './product-details.scss'
})
export class ProductDetails implements OnInit {
  ngOnInit(): void {
    this.loadProduct();
  }
  private productService = inject(ProductService);
  private activatedRoute = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);
  
  product?: Product;

  loadProduct(){
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if(!id) return;
    
    this.productService.getProduct(id).subscribe({
      next: product => {
        console.log('📦 GELEN VERİ:', product);
        this.product = product;
        this.cdr.detectChanges();
      },
      error: err => console.error('❌ HATA:', err)
    });
  }
}