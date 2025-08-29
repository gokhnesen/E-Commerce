import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { delay, finalize } from 'rxjs';
import { BusyService } from '../services/busyService';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const busyService = inject(BusyService);
  

  // if (req.url.includes('/hub/') || 
  //     req.url.includes('signalr') || 
  //     req.url.includes('negotiate')) {  
  //   return next(req);
  // }
  
  busyService.busy();

  return next(req).pipe(
    delay(500),
    finalize(() => busyService.idle())
  );
};
