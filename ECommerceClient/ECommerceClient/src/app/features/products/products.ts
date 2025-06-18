// products.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { ProductService } from '../../core/services/productService';
import { Product } from '../../shared/models/product';
import { MatCard, MatCardContent } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { ProductItem } from "./product-item/product-item";
import { MatDialog} from '@angular/material/dialog';
import { FiltersDialog } from './filters-dialog/filters-dialog';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Brand } from '../../shared/models/brands';
import { response } from 'express';


@Component({
  selector: 'app-products',
  imports: [
    CommonModule,
    ProductItem,
    MatButton,
    MatIcon
],
  templateUrl: './products.html',
  styleUrl: './products.scss'
})
export class Products implements OnInit {
  private productService = inject(ProductService);
  private dialogService = inject(MatDialog)
  
  products$: Observable<Product[]>;
  selectedBrands: Brand[] = [];
  selectedTypes: string[] = [];

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
    openFiltersDialog()
    {
      const dialogRef = this.dialogService.open(FiltersDialog,{
        minWidth: '500px',
        data: {
          selectedBrands: this.selectedBrands,
          selectedTypes: this.selectedBrands

        }
      });
      dialogRef.afterClosed().subscribe({
        next: result =>{
          if(result){
            console.log(result);
            this.selectedBrands = result.selectedBrands;
            this.selectedTypes = result.selectedTypes;
                this.products$ = this.productService.getProducts(this.selectedBrands,this.selectedTypes);
    this.products$.subscribe(data => {});

          }
        }
      })
    }
}