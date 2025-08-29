import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { SignalrService } from './signalrService';
import { environment } from '../../../environments/environment';
import { Order, OrderToCreate } from '../../shared/models/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);
  private signalr = inject(SignalrService);
  orderComplete = false;

  createOrder(orderToCreate: OrderToCreate) {
    return this.http.post<Order>(this.baseUrl + 'order', orderToCreate).pipe(
      tap(order => {
        this.signalr.orderSignal.set(order);
        this.orderComplete = true;
      })
    );
  }

  getOrdersForUser(){
    return this.http.get<Order[]>(this.baseUrl + 'order');
  }

  getOrderDetails(id: string) {
    return this.http.get<Order>(this.baseUrl + 'order/' + id);
  }


}
