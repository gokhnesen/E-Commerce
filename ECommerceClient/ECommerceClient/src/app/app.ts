import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './layout/header/header';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Product } from './shared/models/product';
import { ProductService } from './core/services/productService';
import { Products} from "./features/products/products";
import { ProductDetails } from "./features/products/product-details/product-details";
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';



@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, CommonModule, Products, ProductDetails, MatSnackBarModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App{
    protected title = 'ECommerceClient';

}
