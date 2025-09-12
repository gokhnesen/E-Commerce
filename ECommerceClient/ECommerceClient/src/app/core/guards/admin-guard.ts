import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AccountService } from '../services/accountService';

export const adminGuard: CanActivateFn = async (route, state) => {
  const accountService = inject(AccountService);
  const router = inject(Router);
  const snack = inject(MatSnackBar);

  if (accountService.isAdmin()) return true;

  try {
    await accountService.loadUserFromStorage(); 
    if (accountService.isAdmin()) return true;
  } catch { }

  router.navigateByUrl('');
  return false;
};
