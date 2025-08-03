import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { OrderService } from '../../../core/services/orderService';
import { Order } from '../../../shared/models/order';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { AddressPipe } from "../../../shared/pipes/address.pipe";
import { PaymentCardPipe } from "../../../shared/pipes/payment-card-pipe";
import { AccountService } from '../../../core/services/accountService';
import { Admin } from '../../admin/admin';
import { AdminService } from '../../../core/services/adminService';

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
  private accountService = inject(AccountService);
  private adminService = inject(AdminService);
  private router = inject(Router)
  private cdr = inject(ChangeDetectorRef);
  order?: Order;
  loading = true;
  buttonText = this.accountService.isAdmin() ? 'Return to admin' : 'Return to orders';

  ngOnInit(): void {
    this.loadOrder();
  }

  onReturnClick(){
    this.accountService.isAdmin()
      ? this.router.navigateByUrl('/admin')
      : this.router.navigateByUrl('/orders');
  }

  loadOrder() {
    this.loading = true;
    const id = this.activatedRoute.snapshot.paramMap.get('id');

    if(!id) {
      console.error('No order ID provided');
      this.loading = false;
      return;
    }

    const loadOrderData = this.accountService.isAdmin() 
      ? this.adminService.getOrderDetails(id)
      : this.orderService.getOrderDetails(id);

    loadOrderData.subscribe({
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
