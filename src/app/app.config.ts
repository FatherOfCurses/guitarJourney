// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling, withViewTransitions } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from "@angular/common/http";
import { routes } from './routes';

import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideAuth, getAuth, connectAuthEmulator } from '@angular/fire/auth';
import { provideFirestore, getFirestore, connectFirestoreEmulator } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { environment } from "../environments/environment";
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { definePreset } from '@primeuix/themes';

const GuitarJourneyPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50:  '#FDF4EF',
      100: '#FAE4D5',
      200: '#F5C9AB',
      300: '#EEA980',
      400: '#E58757',
      500: '#C4622D',
      600: '#A34E22',
      700: '#7D3A18',
      800: '#5A290F',
      900: '#3A1A09',
      950: '#1E0D04',
    }
  }
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withComponentInputBinding(),
      withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }),
      withViewTransitions()
    ),
    provideAnimations(),
    provideHttpClient(),
    providePrimeNG({
      theme: {
          preset: GuitarJourneyPreset,
          options: {
            darkModeSelector: false || 'none'
        }
      }
  }),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => {
      const auth = getAuth();
      if (!environment.production) {
        connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
      }
      return auth;
    }),
    provideFirestore(() => {
      const db = getFirestore();
      if (!environment.production) {
        connectFirestoreEmulator(db, '127.0.0.1', 8080);
      }
      return db;
    }),
    provideStorage(() => getStorage()),
  ],
};
