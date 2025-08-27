import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { OrderParams } from '../../shared/models/orderParams';
import { Pagination } from '../../shared/models/pagination';
import { Order } from '../../shared/models/order';
import { Brand } from '../../shared/models/brands';
import { Category } from '../../shared/models/category';
import { Observable } from 'rxjs/internal/Observable';
import { Product } from '../../shared/models/product';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);

  getOrders(orderParams: OrderParams) {
    let params = new HttpParams();
    if(orderParams.filter && orderParams.filter !== 'All')
    {
      params = params.append('status', orderParams.filter);
    }
    params = params.append('pageNumber', orderParams.pageNumber.toString());
    params = params.append('pageSize', orderParams.pageSize.toString());
    return this.http.get<Pagination<Order>>(this.baseUrl + 'admin/orders', { params });
  }

  getOrderDetails(id: string) {
    return this.http.get<Order>(this.baseUrl + 'admin/orders/' + id);
  }

  refundOrder(id: string) {
    return this.http.post<Order>(this.baseUrl + 'admin/orders/refund/' + id, {});
  }

  addProduct(product: any) {
    return this.http.post(this.baseUrl + 'product/add', product);
  }

  uploadImage(formData: FormData) {
    return this.http.post<{ pictureUrl: string }>(this.baseUrl + 'product/upload-image', formData);
  }

  addCategory(category: { name: string }) { 
    return this.http.post<Category>(this.baseUrl + 'category', category); 
  }

  addBrand(brand: { name: string }) { 
  return this.http.post<Brand>(this.baseUrl + 'brands', brand); 
}
deleteProduct(id: string): Observable<any> {
  return this.http.delete(this.baseUrl + 'Product/' + id);
}

deleteCategory(id: string) {
  return this.http.delete(this.baseUrl + 'category/' + id);
}

deleteBrand(id: string) {
  return this.http.delete(this.baseUrl + 'brands/' + id);
}

updateProduct(product: any): Observable<Product> {
  
  return this.http.put<Product>(this.baseUrl + 'product', product);
}
updateProductImage(productId: string, formData: FormData): Observable<{ pictureUrl: string }> {
  
  return this.http.post<{ pictureUrl: string }>(this.baseUrl + 'product/update-image/' + productId, formData);
}
addBrandsToCategory(categoryId: string, brandIds: string[]) {
  return this.http.post(
    `${this.baseUrl}category/${categoryId}/brands`,
    brandIds
  );
}
}
