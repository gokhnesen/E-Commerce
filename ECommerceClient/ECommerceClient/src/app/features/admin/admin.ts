import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { Order } from '../../shared/models/order';
import { AdminService } from '../../core/services/adminService';
import { OrderParams } from '../../shared/models/orderParams';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-admin',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatButton
  ],
  templateUrl: './admin.html',
  styleUrl: './admin.scss'
})
export class Admin implements AfterViewInit, OnInit {

  displayedColumns: string[] = ['id', 'buyerEmail', 'orderDate', 'status','action'];
  dataSource = new MatTableDataSource<Order>([]);
  private adminService = inject(AdminService); // Assuming you have an AdminService to fetch orders
  orderParams = new OrderParams();
  totalItems = 0;
  statusOptions = ['All', 'PaymentReceived', 'PaymentMismatch', 'Refunded', 'Pending'];


  @ViewChild(MatPaginator) paginator!: MatPaginator;


  ngOnInit(): void {
    this.loadOrders();
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  loadOrders() {
    this.adminService.getOrders(this.orderParams).subscribe({
      next: response => {
        if(response.data){
          this.dataSource.data = response.data;
          this.paginator.length = response.count;
          this.totalItems = response.count;
        }
      }
    });
  }

  onPageChange(event: any) {
    this.orderParams.pageNumber = event.pageIndex + 1;
    this.orderParams.pageSize = event.pageSize;
    this.loadOrders();
  }

  onFilterSelect(event: any){
    this.orderParams.filter = event.value;
    this.orderParams.pageNumber = 1;
    this.loadOrders();

  }
}

