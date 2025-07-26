import { Component, inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CartService } from '../../../core/services/cartService';
import { CommonModule, CurrencyPipe, JsonPipe } from '@angular/common';
import { ConfirmationToken } from '@stripe/stripe-js';
import { AddressPipe } from '../../../shared/pipes/address.pipe';
import { PaymentCardPipe } from '../../../shared/pipes/payment-card-pipe';

@Component({
  selector: 'app-checkout-review',
  imports: [
    CurrencyPipe,
    AddressPipe,
    JsonPipe,
    PaymentCardPipe,
    CommonModule
  ],
  templateUrl: './checkout-review.html',
  styleUrl: './checkout-review.scss'
})
export class CheckoutReview{
  cartService = inject(CartService);
  @Input() confirmationToken?: ConfirmationToken;

}