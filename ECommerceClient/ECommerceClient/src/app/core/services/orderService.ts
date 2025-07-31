import { inject, Injectable } from '@angular/core';
import e from 'express';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Order, OrderToCreate } from '../../shared/models/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);
  orderComplete = false;

  createOrder(orderToCreate: OrderToCreate) {
    return this.http.post<Order>(this.baseUrl + 'order', orderToCreate);
  }

  getOrdersForUser(){
    return this.http.get<Order[]>(this.baseUrl + 'order');
  }

  getOrderDetails(id: string) {
    return this.http.get<Order>(this.baseUrl + 'order/' + id);
  }


}
