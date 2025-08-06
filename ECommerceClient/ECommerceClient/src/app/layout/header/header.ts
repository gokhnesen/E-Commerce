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
    MatProgressBar
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

  // Local computed signal to prevent change detection issues
  itemCount = computed(() => this.cartService.itemCount());

  logOut() {
    this.accountService.logout().subscribe({
      next: () => {
        this.accountService.currentUser.set(null);
        this.router.navigateByUrl('/');
      }
    });
  }

}
