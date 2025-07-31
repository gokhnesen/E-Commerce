import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { OrderService } from '../../core/services/orderService';
import { Order} from '../../shared/models/order';
import { RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-order',
  imports: [
    RouterLink,
    DatePipe,
    CurrencyPipe
  ],
  templateUrl: './order.html',
  styleUrl: './order.scss'
})
export class OrderComponent implements OnInit {
  private orderService = inject(OrderService);
  private cdr = inject(ChangeDetectorRef);
  orders: Order[] = [];
  loading = true;

  ngOnInit(): void {
    this.loading = true;
    this.orderService.getOrdersForUser().subscribe({
      next: orders => {
        this.orders = orders;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: error => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    })
  }
}
