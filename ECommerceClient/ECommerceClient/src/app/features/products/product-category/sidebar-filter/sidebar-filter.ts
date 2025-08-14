import { Component, DestroyRef, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { Brand } from '../../../../shared/models/brands';
import { ProductService } from '../../../../core/services/productService';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';


interface Category {
  id: string;
  name: string;
  slug: string;
}

@Component({
  selector: 'app-sidebar-filter',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatIconModule,
    MatCheckboxModule,
    MatButtonModule
  ],
  templateUrl: './sidebar-filter.html',
  styleUrls: ['./sidebar-filter.scss']
})
export class SidebarFilter implements OnInit {


    ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

}
