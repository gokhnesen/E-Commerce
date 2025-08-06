import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject, model } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { SnackbarService } from '../services/snackbarService';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const snackbarService = inject(SnackbarService);
  
  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if(err.status === 400)
      {
        if(err.error.errors) {
          const modelStateErrors = [];
          for(const key in err.error.errors) {
            if(err.error.errors[key]) {
              modelStateErrors.push(err.error.errors[key]);
            }
          }
          throw modelStateErrors.flat();
         } else{
          snackbarService.error(err.error.title || err.error);
         }
      
      }
      if(err.status === 401)
      {
        snackbarService.error(err.error.title || err.error);
      }
      if(err.status === 404){
        router.navigateByUrl('/notfound');
      }

      if(err.status === 500){
        const navigationExtras: NavigationExtras = {state: {error: err.error}}
        router.navigateByUrl('/internal-error', navigationExtras);
      }
      return throwError(() => err)

    })
  )
};
