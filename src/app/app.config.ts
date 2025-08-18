;// app.config.ts
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling, withViewTransitions } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors /*, withInterceptors */ } from "@angular/common/http";
import { routes } from './routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { environment} from "../environments/environment";

// PrimeNG global config (optional)
// import { PrimeNGConfig } from 'primeng/api';

// If you need *module* providers (rare in PrimeNG 20; most components are standalone):
// import { ButtonModule } from 'primeng/button';
// import { InputTextModule } from 'primeng/inputtext';
// import { InputTextareaModule } from 'primeng/inputtextarea';

 //import { authInterceptor } from './auth/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withComponentInputBinding(),
      withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }),
      withViewTransitions()
    ),
    provideAnimations(),
    provideHttpClient(
       //withInterceptors([authInterceptor])
    ),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),

    // If you truly need module-based providers (not typical for PrimeNG 20):
    // importProvidersFrom(ButtonModule, InputTextModule, InputTextareaModule),

    // Optionally set/override global PrimeNG config:
    // { provide: PrimeNGConfig, useValue: { ripple: true } },
  ],
};
