import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './layout/header/header';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Product } from './shared/models/product';
import { ProductService } from './core/services/productService';
import { Products} from "./features/products/products";



@Component({
  selector: 'app-root',
  imports: [Header, CommonModule, Products],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App{
    protected title = 'ECommerceClient';

}
