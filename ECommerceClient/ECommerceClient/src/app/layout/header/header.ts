import { Component, inject } from '@angular/core';
import {MatIcon} from '@angular/material/icon'
import {MatButton} from '@angular/material/button'
import {MatBadge} from '@angular/material/badge'
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../core/services/cartService';
import { AccountService } from '../../core/services/accountService';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatDivider } from '@angular/material/divider';



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
    MatMenuItem
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {
  cartService = inject(CartService);
  accountService = inject(AccountService);
  private router = inject(Router);

  logOut() {
    this.accountService.logout().subscribe({
      next: () => {
        this.accountService.currentUser.set(null);
        this.router.navigateByUrl('/');
      }
    });
  }

}
