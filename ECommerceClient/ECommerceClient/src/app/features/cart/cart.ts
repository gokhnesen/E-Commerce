import { Component, inject } from '@angular/core';
import { CartService } from '../../core/services/cartService';

@Component({
  selector: 'app-cart',
  imports: [],
  templateUrl: './cart.html',
  styleUrl: './cart.scss'
})
export class Cart {
  cartService = inject(CartService);
}
