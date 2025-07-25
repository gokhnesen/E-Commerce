import { Component, inject, OnInit } from '@angular/core';
import { CheckoutService } from '../../../core/services/checkoutService';
import { MatRadioModule } from '@angular/material/radio';
import { CurrencyPipe } from '@angular/common';
import { CartService } from '../../../core/services/cartService';
import { DeliveryMethod } from '../../../shared/models/deliveryMethod';
@Component({
  selector: 'app-checkout-delivery',
  imports: [
    MatRadioModule,
    CurrencyPipe
  ],
  templateUrl: './checkout-delivery.html',
  styleUrl: './checkout-delivery.scss'
})
export class CheckoutDelivery implements OnInit {

  checkoutService = inject(CheckoutService);
  cartService = inject(CartService);


    ngOnInit(): void {
    this.checkoutService.getDeliveryMethods().subscribe({
      next: methods => {
        if(this.cartService.cart()?.deliveryMethodId){
          const method = methods.find(x => x.id === this.cartService.cart()?.deliveryMethodId);
          if(method){
            this.cartService.selectedDelivery.set(method);
          }
        }
      }
    });
  }
  updateDeliveryMethod(method: DeliveryMethod){
    this.cartService.selectedDelivery.set(method);
    const cart = this.cartService.cart();
    if(cart){
      cart.deliveryMethodId = method.id;
      this.cartService.setCart(cart);
    }
  }
}
