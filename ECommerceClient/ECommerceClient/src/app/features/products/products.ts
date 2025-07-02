// products.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { ProductService } from '../../core/services/productService';
import { Product } from '../../shared/models/product';
import { CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs';
import { ProductItem } from "./product-item/product-item";
import { MatDialog} from '@angular/material/dialog';
import { FiltersDialog } from './filters-dialog/filters-dialog';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Brand } from '../../shared/models/brands';
import { MatListOption, MatSelectionList, MatSelectionListChange } from '@angular/material/list';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { ShopParams } from '../../shared/models/productParam';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Pagination } from '../../shared/models/pagination';
import { count } from 'node:console';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-products',
  imports: [
    CommonModule,
    ProductItem,
    MatButton,
    MatIcon,
    MatMenu,
    MatSelectionList,
    MatListOption,
    MatMenuTrigger,
    MatPaginator,
    FormsModule
  ],
  templateUrl: './products.html',
  styleUrl: './products.scss'
})
export class Products implements OnInit {
  private productService = inject(ProductService);
  private dialogService = inject(MatDialog)
  products$: Observable<Pagination<Product>> = of({} as Pagination<Product>);
  sortOptions = [
    {name: 'Alphabetical', value: 'name'},
    {name: 'Price: Low-High', value: 'priceAsc'},
    {name: 'Price: High-Low', value: 'priceDesc'},
  ]
  totalCount = 0;
  shopParams = new ShopParams();
  pageSizeOptions= [5,10,15,20]

  constructor() {
    
  }

  ngOnInit(): void {
    this.initializeProduct();
  }

  initializeProduct() {
    this.productService.getBrands();
    this.productService.getTypes();
    this.getProducts();
  }

  getProducts(){
    this.products$ = this.productService.getProducts(this.shopParams);
    this.products$.subscribe(data => {
      console.log('🎯 Async pipe - Veri geldi:', data);
      this.totalCount = this.products$.subscribe.length;
    });
    
  }
  onSearchChange(){
    this.shopParams.pageNumber = 1;
    this.getProducts();
  }

  handlePageEvent(event: PageEvent){
    this.shopParams.pageNumber = event.pageIndex + 1;
    this.shopParams.pageSize = event.pageSize;
    this.getProducts();
  }

  onSortChange(event: MatSelectionListChange){
    const selectedOption = event.options[0];
    if(selectedOption) {
      this.shopParams.sort = selectedOption.value;
      this.shopParams.pageNumber = 1;
      console.log(this.shopParams.sort);
      this.getProducts();
    }
  }

  openFiltersDialog() {
    const dialogRef = this.dialogService.open(FiltersDialog,{
      minWidth: '500px',
      data: {
        selectedBrands: this.shopParams.brands,
        selectedTypes: this.shopParams.categories
      }
    });
    
    dialogRef.afterClosed().subscribe({
      next: result => {
        if(result){
          console.log(result);
          this.shopParams.brands = result.selectedBrands;
          this.shopParams.categories = result.selectedTypes;
          this.shopParams.pageNumber = 1;
          
          this.getProducts();
        }
      }
    })
  }
}