import { Component, inject } from '@angular/core';
import { CartService } from '../../core/services/cartService';
import { CartItemComponent } from "./cart-item/cart-item";
import { OrderSummary } from "../../shared/components/order-summary/order-summary";

@Component({
  selector: 'app-cart',
  imports: [CartItemComponent, OrderSummary],
  templateUrl: './cart.html',
  styleUrl: './cart.scss'
})
export class Cart {
  cartService = inject(CartService);
  
}
