import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartItem } from '../../../shared/models/cart';

@Component({
  selector: 'app-cart-item',
  imports: [
    RouterLink
  ],
  templateUrl: './cart-item.html',
  styleUrl: './cart-item.scss'
})
export class CartItemComponent {
  item = input.required<CartItem>();
}
