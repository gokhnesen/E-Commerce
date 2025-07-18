import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartItem } from '../../../shared/models/cart';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-cart-item',
  imports: [
    RouterLink,
    MatButton,
    MatIcon,
    CurrencyPipe
  ],
  templateUrl: './cart-item.html',
  styleUrl: './cart-item.scss'
})
export class CartItemComponent {
  item = input.required<CartItem>();
}
