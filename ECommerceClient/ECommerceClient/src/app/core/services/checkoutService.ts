import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { DeliveryMethod } from '../../shared/models/deliveryMethod';
import { HttpClient } from '@angular/common/http';
import { map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);
  deliveryMethods: DeliveryMethod[] = [];

getDeliveryMethods(): Observable<DeliveryMethod[]> {
  if (this.deliveryMethods.length > 0) {
    return of(this.deliveryMethods);
  }
  return this.http.get<DeliveryMethod[]>(this.baseUrl + 'payment/delivery-methods').pipe(
    map(methods => {
      this.deliveryMethods = methods.sort((a, b) => b.price - a.price);
      return this.deliveryMethods;
    })
  );
}


}
