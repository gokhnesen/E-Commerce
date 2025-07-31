import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OrderService } from '../../../core/services/orderService';
import { Order } from '../../../shared/models/order';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { AddressPipe } from "../../../shared/pipes/address.pipe";
import { PaymentCardPipe } from "../../../shared/pipes/payment-card-pipe";

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
    PaymentCardPipe
],
  templateUrl: './order-detailed.html',
  styleUrl: './order-detailed.scss'
})
export class OrderDetailed implements OnInit {
  private orderService = inject(OrderService);
  private activatedRoute = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);
  order?: Order;
  loading = true;

  ngOnInit(): void {
    this.loadOrder();
  }

  loadOrder() {
    this.loading = true; // Ekle
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    console.log('Loading order with ID:', id); // Debug için

    if(!id) {
      console.error('No order ID provided');
      this.loading = false; // Ekle
      return;
    }

    this.orderService.getOrderDetails(id).subscribe({
      next: order => {
        console.log('Loaded order:', order);
        this.order = order;
        this.loading = false;
        this.cdr.detectChanges(); // Manuel change detection
      },
      error: error => {
        console.error('Error loading order:', error);
        this.loading = false;
        this.cdr.detectChanges(); // Manuel change detection
      }
    });
  }
}
