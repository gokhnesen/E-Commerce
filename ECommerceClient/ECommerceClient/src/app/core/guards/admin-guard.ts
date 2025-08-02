import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AccountService } from '../services/accountService';
import { MatSnackBar } from '@angular/material/snack-bar';

export const adminGuard: CanActivateFn = (route, state) => {
  const accountService = inject(AccountService);
  const router = inject(Router);
  const snack = inject(MatSnackBar);

  if(accountService.isAdmin()) {
    return true;
  } else{
    snack.open('You do not have permission to access this page', 'Close', { duration: 3000 });
    router.navigateByUrl('/products');
    return false;
  }

};
