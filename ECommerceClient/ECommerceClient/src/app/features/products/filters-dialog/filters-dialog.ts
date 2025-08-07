import { Component, inject } from '@angular/core';
import { ProductService } from '../../../core/services/productService';
import {MatDivider} from '@angular/material/divider';
import {MatListOption, MatSelectionList} from '@angular/material/list';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Brand } from '../../../shared/models/brands';
import { FormsModule } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'app-filters-dialog',
  imports: [
    MatDivider,
    MatSelectionList,
    MatListOption,
    MatButton,
    FormsModule,
    MatFormField,
    MatLabel,
    MatInput
  ],
  templateUrl: './filters-dialog.html',
  styleUrl: './filters-dialog.scss'
})
export class FiltersDialog {
  productService = inject(ProductService);
  private dialogRef = inject(MatDialogRef<FiltersDialog>);
  data = inject(MAT_DIALOG_DATA)

  selectedBrands: Brand[] = this.data.selectedBrands || []
  minPrice: number | null = this.data.minPrice || null
  maxPrice: number | null = this.data.maxPrice || null

  applyFilters(){
    this.dialogRef.close({
      selectedBrands: this.selectedBrands,
      minPrice: this.minPrice,
      maxPrice: this.maxPrice
    })
  }

  clearFilters(){
    this.selectedBrands = [];
    this.minPrice = null;
    this.maxPrice = null;
  }
}
