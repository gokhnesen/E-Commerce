import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CartService } from './cartService';
import { of, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InitService {
  private cartService = inject(CartService);
  private platformId = inject(PLATFORM_ID);
  
  init(): Observable<any> {
    if (isPlatformBrowser(this.platformId)) {
      try {
        const cartId = localStorage.getItem('cart_id');
        return cartId ? this.cartService.getCart(cartId) : of(null);
      } catch (error) {
        console.error('localStorage error:', error);
        return of(null);
      }
    }
    
    return of(null);
  }
}