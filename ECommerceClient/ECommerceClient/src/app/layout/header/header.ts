import { Component, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import {MatIcon} from '@angular/material/icon'
import {MatButton} from '@angular/material/button'
import {MatBadge} from '@angular/material/badge'
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../core/services/cartService';
import { AccountService } from '../../core/services/accountService';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatDivider } from '@angular/material/divider';
import { IsAdmin } from '../../shared/directives/is-admin';
import { BusyService } from '../../core/services/busyService';
import { MatProgressBar } from '@angular/material/progress-bar';
import { AsyncPipe } from '@angular/common';
import { ShopParams } from '../../shared/models/productParam';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../core/services/productService';


@Component({
  selector: 'app-header',
  imports: [
    MatIcon,
    MatButton,
    MatBadge,
    RouterLink,
    RouterLinkActive,
    MatMenuTrigger,
    MatMenu,
    MatDivider,
    MatMenuItem,
    IsAdmin,
    MatProgressBar,
    AsyncPipe,
    FormsModule
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Header {
  busyService = inject(BusyService);
  cartService = inject(CartService);
  accountService = inject(AccountService);
  private router = inject(Router);
  searchTerm = '';
  itemCount = computed(() => this.cartService.itemCount());

  onSearch() {
    if (this.searchTerm.trim()) {
      this.router.navigate(['/product'], { 
        queryParams: { search: this.searchTerm.trim() } 
      }).then(() => {
        window.location.reload();
      });
    }
  }

  onSearchKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.onSearch();
    }
  }

  logOut() {
    this.accountService.logout().subscribe({
      next: () => {
        this.accountService.currentUser.set(null);
        this.router.navigateByUrl('/');
      }
    });
  }

}
