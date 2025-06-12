import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './layout/header/header';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Product } from './shared/models/product';
import { ProductService } from './core/services/productService';



@Component({
  selector: 'app-root',
  imports: [Header,CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  private productService = inject(ProductService)


  protected title = 'ECommerceClient';

  products: Product[] = [];

ngOnInit(): void {
  this.productService.getProducts().subscribe({
    next: response => this.products = response,
    error: error => console.log('Error:', error),
    complete: () => console.log('complete')
  })
}
}
