import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { delay, finalize, identity } from 'rxjs';
import { BusyService } from '../services/busyService';
import { environment } from '../../../environments/environment';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const busyService = inject(BusyService);
  

  // if (req.url.includes('/hub/') || 
  //     req.url.includes('signalr') || 
  //     req.url.includes('negotiate')) {  
  //   return next(req);
  // }
  
  busyService.busy();

  return next(req).pipe(
    (environment.production ? identity : delay(500)),
    finalize(() => busyService.idle())
  );
};
