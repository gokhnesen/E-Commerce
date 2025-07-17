import { Component, inject } from '@angular/core';
import {MatIcon} from '@angular/material/icon'
import {MatButton} from '@angular/material/button'
import {MatBadge} from '@angular/material/badge'
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../core/services/cartService';



@Component({
  selector: 'app-header',
  imports: [
    MatIcon,
    MatButton,
    MatBadge,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {
  cartService = inject(CartService);

}
