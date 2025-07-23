import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CartService } from '../services/cartService';
import { MatSnackBar } from '@angular/material/snack-bar';

export const emptyCartGuard: CanActivateFn = async (route, state) => {
  const cartService = inject(CartService);
  const router = inject(Router);
  const snack = inject(MatSnackBar);

  const cart = cartService.cart();

  if (!cart || cart.items.length === 0) {
    snack.open('Your cart is empty. Please add items to your cart before proceeding to checkout.');
    await router.navigateByUrl('/cart');
    return false;
  }

  return true;
};
