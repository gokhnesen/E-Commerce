import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OrderService } from '../../../core/services/orderService';
import { Order } from '../../../shared/models/order';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { AddressPipe } from "../../../shared/pipes/address.pipe";
import { PaymentCardPipe } from "../../../shared/pipes/payment-card-pipe";
import { Router } from 'express';

@Component({
  selector: 'app-order-detailed',
  standalone: true,
  imports: [
    MatCardModule,
    MatButton,
    DatePipe,
    CurrencyPipe,
    RouterLink,
    AddressPipe,
    PaymentCardPipe,
    RouterLink
],
  templateUrl: './order-detailed.html',
  styleUrl: './order-detailed.scss'
})
export class OrderDetailed implements OnInit {
  private orderService = inject(OrderService);
  private activatedRoute = inject(ActivatedRoute);
  order?: Order;

  ngOnInit(): void {
    this.loadOrder();
  }

  loadOrder() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    console.log('Loading order with ID:', id); // Debug için

    if(!id) {
      console.error('No order ID provided');
      return;
    }

    this.orderService.getOrderDetails(id).subscribe({
      next: order => {
        console.log('Loaded order:', order); // Debug için
        this.order = order;
      },
      error: error => {
        console.error('Error loading order:', error);
      }
    });
  }
}
