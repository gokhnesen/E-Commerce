import { APP_INITIALIZER, ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection, PLATFORM_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { InitService } from './core/services/initService';
import { lastValueFrom } from 'rxjs';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { authInterceptor } from './core/interceptors/auth-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes), 
    provideClientHydration(withEventReplay()),
    provideHttpClient(withInterceptors([
      authInterceptor
    ])),
    provideAppInitializer(async () => {
      const platformId = inject(PLATFORM_ID);
      
      if (isPlatformBrowser(platformId)) {
        const initService = inject(InitService);
        return lastValueFrom(initService.init()).finally(() => {
          const splash = document.getElementById('initial-splash');
          if (splash) {
            splash.remove();
          }
        });
      }
      
      return Promise.resolve();
    }),
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: {autoFocus: 'dialog', restoreFocus: true}
    }
  ]
};