import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CartService } from './cartService';
import { of, Observable, forkJoin, tap } from 'rxjs';
import { AccountService } from './accountService';
import { SignalrService } from './signalrService';

@Injectable({
  providedIn: 'root'
})
export class InitService {
  private cartService = inject(CartService);
  private platformId = inject(PLATFORM_ID);
  private accountService = inject(AccountService);
  private signalrService = inject(SignalrService); 
  
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
    
    const cart$ = of(null);
    return forkJoin({
      cart: cart$,
      user: this.accountService.getUserInfo().pipe(
        tap(user =>{
          if(user) this.signalrService.createHubConnection();
        })
      )
    });
  }
}