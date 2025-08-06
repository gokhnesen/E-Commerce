import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection, PLATFORM_ID } from '@angular/core';
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { InitService } from './core/services/initService';
import { AccountService } from './core/services/accountService'; 
import { lastValueFrom } from 'rxjs';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { authInterceptor } from './core/interceptors/auth-interceptor';
import { errorInterceptor } from './core/interceptors/error-interceptor';
import { loadingInterceptor } from './core/interceptors/loading-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes, withEnabledBlockingInitialNavigation()), 
    // SSR geçici kapatıldı - loading interceptor sorunları için
    // provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch(), withInterceptors([
      authInterceptor, errorInterceptor,
       loadingInterceptor
    ])),
    provideAppInitializer(() => {
      const platformId = inject(PLATFORM_ID);
             
      if (isPlatformBrowser(platformId)) {
        return (async () => {
          const initService = inject(InitService);
          const accountService = inject(AccountService);
          await lastValueFrom(initService.init());
          await accountService.loadUserFromStorage();
          const splash = document.getElementById('initial-splash');
          if (splash) {
            splash.remove();
          }
        })();
      }
             
      return Promise.resolve();
    }),
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: {autoFocus: 'dialog', restoreFocus: true}
    }
  ]
};