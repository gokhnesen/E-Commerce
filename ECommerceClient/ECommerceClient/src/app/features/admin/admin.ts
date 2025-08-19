import { AfterViewInit, Component, inject, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Order } from '../../shared/models/order';
import { AdminService } from '../../core/services/adminService';
import { OrderParams } from '../../shared/models/orderParams';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MatLabel } from '@angular/material/form-field';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterLink } from '@angular/router';
import { DialogService } from '../../core/services/dialogService';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../core/services/productService';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-admin',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatButton,
    MatIcon,
    MatSelectModule,
    DatePipe,
    CurrencyPipe,
    MatLabel,
    MatTooltipModule,
    MatTabsModule,
    RouterLink,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule
  ],
  templateUrl: './admin.html',
  styleUrl: './admin.scss'
})
export class Admin implements OnInit {
[x: string]: any;
  displayedColumns: string[] = ['id', 'buyerEmail', 'orderDate', 'total', 'status', 'action'];
  dataSource = new MatTableDataSource<Order>([]);
  private adminService = inject(AdminService);
  private dialogService = inject(DialogService)
  private cdr = inject(ChangeDetectorRef);
  orderParams = new OrderParams();
  totalItems = 0;
  statusOptions = ['All', 'PaymentReceived', 'PaymentMismatch', 'Refunded', 'Pending'];
  loading = true;
  productForm: FormGroup;
  addProductSuccess = false;
  addProductError = false;
  private productService = inject(ProductService);


  selectedFile: File | null = null;
  previewUrl: string | null = null;


  constructor(private fb: FormBuilder) {
this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      price: [null, Validators.required],
      stock: [0, Validators.required],
      categoryName: ['', Validators.required],
      brandName: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders() {
    this.loading = true;
    this.adminService.getOrders(this.orderParams).subscribe({
      next: response => {
        console.log('Admin orders response:', response);
        if (response.data) {
          this.dataSource.data = response.data;
          this.totalItems = response.count;
          console.log('Orders loaded:', response.data);
        } else {
          this.dataSource.data = response as any;
          this.totalItems = (response as any).length;
          console.log('Direct array orders:', response);
        }
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: error => {
        console.error('Error loading orders:', error);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onPageChange(event: PageEvent) {
    this.orderParams.pageNumber = event.pageIndex + 1;
    this.orderParams.pageSize = event.pageSize;
    this.loadOrders();
  }

  onFilterSelect(event: MatSelectChange) {
    this.orderParams.filter = event.value;
    this.orderParams.pageNumber = 1;
    this.loadOrders();
  }

  async openConfirmDialog(id: string) {
    const confirmed = await this.dialogService.confirm(
      'Confirm Refund',
      'Are you sure you want to refund this order?'
    )
    if (confirmed) this.refundOrder(id);
  }

  refundOrder(id: string) {
    this.adminService.refundOrder(id).subscribe({
      next: order => {
        this.dataSource.data = this.dataSource.data.map(o => o.id === order.id ? order : o);
      }
    });
  }

  onFileSelected(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    this.selectedFile = input.files[0];

    // 👇 küçük önizleme için
    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result as string;
    };
    reader.readAsDataURL(this.selectedFile);
  }
  }

 addProduct() {
  if (this.productForm.invalid) {
    console.log('Form geçersiz:', this.productForm.errors);
    this.markFormGroupTouched();
    return;
  }
  if (!this.selectedFile) {
    console.log('Dosya seçilmedi');
    return;
  }

  console.log('Form değerleri:', this.productForm.value);

  const formData = new FormData();
  formData.append('Image', this.selectedFile);

  this.adminService.uploadImage(formData).subscribe({
    next: (response: any) => {
      const pictureUrl = response.pictureUrl;
      const productData = {
        ...this.productForm.value,
        pictureUrl,
      };

      this.adminService.addProduct(productData).subscribe({
        next: () => {
          this.addProductSuccess = true;
          this.addProductError = false;
          this.productForm.reset();
          this.selectedFile = null;
          this.previewUrl = null;
        },
        error: (error) => {
          console.error('Ürün ekleme hatası:', error);
          this.addProductSuccess = false;
          this.addProductError = true;
        }
      });
    },
    error: (error) => {
      console.error('Resim yükleme hatası:', error);
      this.addProductSuccess = false;
      this.addProductError = true;
    }
  });
}
private markFormGroupTouched() {
  Object.keys(this.productForm.controls).forEach(key => {
    const control = this.productForm.get(key);
    control?.markAsTouched();
  });
}
}
