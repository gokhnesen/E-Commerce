import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class BusyService {
  loading = false;
  busyRequestCount = 0;
  private timeoutId?: number;
  private platformId = inject(PLATFORM_ID);

  busy(){
    // SSR'da loading çalışmasın
    if (!isPlatformBrowser(this.platformId)) {
      console.log('🔄 SSR - BusyService busy() atlandı');
      return;
    }
    
    this.busyRequestCount++;
    this.loading = true;
    console.log('🔄 BusyService - busy() called. Count:', this.busyRequestCount, 'Loading:', this.loading);
    
    // 10 saniye sonra zorla temizle (stuck loading önlemi) - sadece browser'da
    if (isPlatformBrowser(this.platformId)) {
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
      }
      this.timeoutId = window.setTimeout(() => {
        console.warn('🚨 BusyService timeout - Forcing idle state');
        this.forceIdle();
      }, 10000);
    }
  }

  idle(){
    // SSR'da loading çalışmasın
    if (!isPlatformBrowser(this.platformId)) {
      console.log('⏸️ SSR - BusyService idle() atlandı');
      return;
    }
    
    this.busyRequestCount--;
    console.log('⏸️ BusyService - idle() called. Count:', this.busyRequestCount);
    if(this.busyRequestCount <= 0){
      this.busyRequestCount = 0;
      this.loading = false;
      console.log('✅ BusyService - Loading stopped. Count:', this.busyRequestCount, 'Loading:', this.loading);
      if (isPlatformBrowser(this.platformId) && this.timeoutId) {
        clearTimeout(this.timeoutId);
        this.timeoutId = undefined;
      }
    }
  }

  forceIdle(){
    console.log('🚨 BusyService - forceIdle() called. Previous count:', this.busyRequestCount);
    this.busyRequestCount = 0;
    this.loading = false;
    if (isPlatformBrowser(this.platformId) && this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = undefined;
    }
    console.log('✅ BusyService - forceIdle() completed. Count:', this.busyRequestCount, 'Loading:', this.loading);
  }

  // Debug metodu - manuel reset için
  resetLoadingState() {
    console.log('🔄 BusyService - Manual reset called. Previous count:', this.busyRequestCount);
    this.forceIdle();
  }

  // Debug metodu - mevcut durumu görmek için  
  getState() {
    return {
      loading: this.loading,
      busyRequestCount: this.busyRequestCount,
      hasTimeout: !!this.timeoutId
    };
  }
}
