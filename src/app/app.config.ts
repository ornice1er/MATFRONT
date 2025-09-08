import { ApplicationConfig, importProvidersFrom, LOCALE_ID, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import { AuthGuard } from './core/guards/auth.guard';
import { AppHttpInterceptor } from './core/utils/app-http-interceptor';
import localeFr from '@angular/common/locales/fr';
import { registerLocaleData } from '@angular/common';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { TRANSLATE_PROVIDERS } from './core/providers/translate.providers';
import { LucideAngularModule, BarChart3, Users, FileText, Clock, TrendingUp,AlertCircle} from 'lucide-angular';

registerLocaleData(localeFr);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    provideClientHydration(), 
    provideHttpClient(
      withInterceptorsFromDi(),
      withFetch()
    ),
    provideAnimationsAsync(),
    provideToastr(), 
    provideCharts(withDefaultRegisterables()),
      importProvidersFrom(
      LucideAngularModule.pick({ BarChart3, Users, FileText, Clock,TrendingUp,AlertCircle})
    ),
   // TRANSLATE_PROVIDERS,
    { provide: LOCALE_ID, useValue: 'fr' },
    AuthGuard,
    { provide: HTTP_INTERCEPTORS, useClass: AppHttpInterceptor, multi: true }
  ]
};
