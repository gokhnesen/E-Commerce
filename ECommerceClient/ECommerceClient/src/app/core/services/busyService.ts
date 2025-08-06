import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class BusyService {
  loading = false;
  busyRequestCount = 0;

  busy(){
    this.busyRequestCount++;
    this.loading = true;
  }
  idle(){
    this.busyRequestCount--;
    if (this.busyRequestCount <= 0) {
      this.busyRequestCount = 0;
      this.loading = false;
    }
  }
}
