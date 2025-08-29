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
import { Product } from '../../shared/models/product';
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
  displayedColumns: string[] = ['buyerEmail', 'orderDate', 'total', 'status', 'action'];
  dataSource = new MatTableDataSource<Order>([]);
  private adminService = inject(AdminService);
  private dialogService = inject(DialogService)
  private cdr = inject(ChangeDetectorRef);
  orderParams = new OrderParams();
  totalItems = 0;
  statusOptions = ['Hepsi', 'Basarili', 'Odenmedi', 'Iade', 'Beklemede'];
  loading = true;
  productForm: FormGroup;
  addProductSuccess = false;
  addProductError = false;
  private productService = inject(ProductService);

  showAddProductModal = false;
  showAddCategoryModal = false;
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  updatePreviewUrl: string | null = null;
  updateSelectedFile: File | null = null;

  categories: any[] = [];
  brands: any[] = [];

  categoryForm: FormGroup;
  brandForm: FormGroup;

  products: Product[] = [];
  filteredProducts: Product[] = [];
  productSearchTerm: string = '';
  showUpdateForm = false;
  updateForm: FormGroup;
  selectedProductId: string | null = null;

  categoryForBrand: string | null = null;

  showDeleteCategoryBrandModal = false;
  selectedCategoryId: string | null = null;
  selectedBrandId: string | null = null;

  constructor(private fb: FormBuilder) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      price: [null, Validators.required],
      stock: [0, Validators.required],
      categoryName: ['', Validators.required],
      brandName: ['', Validators.required]
    });
    this.categoryForm = this.fb.group({
      name: ['', Validators.required]
    });
    this.brandForm = this.fb.group({
      name: ['', Validators.required]
    });
    this.updateForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      price: [0, Validators.required],
      stock: [0, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadOrders();
    this.productService.getCategories().subscribe({
      next: (data) => this.categories = data,
      error: (err) => console.error(err)
    });
    this.productService.getBrands().subscribe({
      next: (brands) => this.brands = brands,
      error: (err) => console.error('Markalar yüklenemedi:', err)
    });

    this.loadProducts();
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

  loadProducts() {
    this.productService.getProducts({
      pageNumber: 1, pageSize: 50,
      brands: [],
      categories: [],
      sort: '',
      search: ''
    }).subscribe({
      next: (res) => {
        this.products = res.data || res;
        this.filteredProducts = this.products;
      },
      error: (err) => console.error('Ürünler yüklenemedi:', err)
    });
  }

  onPageChange(event: PageEvent) {
    this.orderParams.pageNumber = event.pageIndex + 1;
    this.orderParams.pageSize = event.pageSize;
    this.loadOrders();
  }

  onFilterSelect(event: MatSelectChange) {
    const val = event.value;
    // "Hepsi" seçildiğinde filtreyi temizle (sunucu tarafı filtre uygulanmasın)
    if (!val || val === 'Hepsi') {
      this.orderParams.filter = '';
    } else {
      this.orderParams.filter = val;
    }
    this.orderParams.pageNumber = 1;
    this.loadOrders();
  }

  async openConfirmDialog(id: string) {
    const confirmed = await this.dialogService.confirm(
      'İade et',
      'Bu siparişi iade etmek istediğinizden emin misiniz?'
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
  if (this.productForm.invalid || !this.selectedFile) return;

  const formValue = this.productForm.value;
  // ID'den kategori adını bul
  const selectedCategory = this.categories.find(cat => cat.id === formValue.categoryName);
  const categoryName = selectedCategory ? selectedCategory.name : '';

  const formData = new FormData();
  formData.append('Image', this.selectedFile);

  this.adminService.uploadImage(formData).subscribe({
    next: (response: any) => {
      const productData = {
        ...formValue,
        categoryName,
        pictureUrl: response.pictureUrl
      };
      this.adminService.addProduct(productData).subscribe({
        next: () => {
          this.addProductSuccess = true;
          this.addProductError = false;
          this.productForm.reset();
          this.selectedFile = null;
          this.previewUrl = null;
        },
        error: (error: any) => {
          this.addProductSuccess = false;
          this.addProductError = true;
        }
      });
    },
    error: (error: any) => {
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

onCategoryChange(event: any) {
    const categoryId = event.value;
    this.productForm.patchValue({ brandName: null }); // Marka seçimini sıfırla
    this.productService.getCategoryBrands(categoryId).subscribe({
      next: (data) => this.brands = data,
      error: (err) => console.error(err)
    });
  }

  addCategory() {
  if (this.categoryForm.invalid) return;
  const categoryName = this.categoryForm.value.name;
  // Servis ile kategori ekle (örnek)
  this.adminService.addCategory({ name: categoryName }).subscribe({
    next: (cat) => {
      this.categories.push(cat);
      this.categoryForm.reset();
    },
    error: (err) => console.error('Kategori ekleme hatası:', err)
  });
}

  onCategoryForBrandChange(event: any) {
  this.categoryForBrand = event.value;
}

  // Marka ekleme fonksiyonu
  addBrand() {
    if (this.brandForm.invalid || !this.categoryForBrand) return;
    const brandName = this.brandForm.value.name;

    // Önce marka oluştur, sonra kategoriye ekle
    this.adminService.addBrand({ name: brandName }).subscribe({
      next: (brand) => {
        // Marka başarıyla oluşturulduysa kategoriye ekle
        this.adminService.addBrandsToCategory(this.categoryForBrand!, [brand.id]).subscribe({
          next: () => {
            this.brands.push(brand);
            this.brandForm.reset();
            this.categoryForBrand = null;
          },
          error: (err) => console.error('Marka kategoriye eklenemedi:', err)
        });
      },
      error: (err) => console.error('Marka ekleme hatası:', err)
    });
  }

deleteProduct(id: string) {
  this.adminService.deleteProduct(id).subscribe({
    next: () => {
      this.loadProducts(); // Ürünleri tekrar çek ve listeyi güncelle
    },
    error: (err) => console.error('Silme hatası:', err)
  });
  }

  openUpdateForm(product: Product) {
    this.showUpdateForm = true;
    this.selectedProductId = product.id;
    this.updateForm.patchValue({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock
    });
    this.updatePreviewUrl = product.pictureUrl;
    this.updateSelectedFile = null;
  }

  closeUpdateForm() {
    this.showUpdateForm = false;
    this.selectedProductId = null;
    this.updateForm.reset();
  }

  onUpdateFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.updateSelectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => this.updatePreviewUrl = e.target.result;
      reader.readAsDataURL(file);
    }
  }

  updateProduct() {
  if (this.updateForm.invalid) return;
  const updated = {
    ...this.updateForm.value,
    id: this.selectedProductId
  };

  // Eğer yeni fotoğraf seçildiyse önce upload et
  if (this.updateSelectedFile) {
    const formData = new FormData();
    formData.append('Image', this.updateSelectedFile);
    this.adminService.updateProductImage(this.selectedProductId!, formData).subscribe({
      next: (res) => {
        updated.pictureUrl = res.pictureUrl;
        this.sendUpdateProduct(updated);
      },
      error: (err) => { /* hata yönetimi */ }
    });
  } else {
    this.sendUpdateProduct(updated);
  }
}

sendUpdateProduct(updated: any) {
  this.adminService.updateProduct(updated).subscribe({
    next: (res) => {
      this.loadProducts(); // Ürünleri tekrar çek ve listeyi güncelle
      this.closeUpdateForm();
    },
    error: (err) => { /* hata yönetimi */ }
  });
}

onProductSearch() {
  const term = this.productSearchTerm.trim().toLowerCase();
  if (!term) {
    this.filteredProducts = this.products;
    return;
  }
  this.filteredProducts = this.products.filter(p =>
    p.name.toLowerCase().includes(term)
  );
}

deleteCategory(id: string) {
  this.adminService.deleteCategory(id).subscribe({
    next: () => {
      this.categories = this.categories.filter(c => c.id !== id);
      this.selectedCategoryId = null;
    },
    error: err => console.error('Kategori silme hatası:', err)
  });
}

deleteBrand(id: string) {
  this.adminService.deleteBrand(id).subscribe({
    next: () => {
      this.brands = this.brands.filter(b => b.id !== id);
      this.selectedBrandId = null;
    },
    error: err => console.error('Marka silme hatası:', err)
  });
}
}
