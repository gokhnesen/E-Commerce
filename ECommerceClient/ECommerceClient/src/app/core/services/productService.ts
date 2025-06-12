import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Product } from '../../shared/models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  baseuRL = 'https://localhost:7091/api/'
  private http = inject(HttpClient);

  getProducts(){
      return this.http.get<Product[]>(this.baseuRL + 'Product')
  }
  
}
