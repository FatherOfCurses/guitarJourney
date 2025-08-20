// app.config.ts
import { ApplicationConfig, APP_INITIALIZER, inject } from '@angular/core';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling, withViewTransitions } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from "@angular/common/http";
import { routes } from './routes';

import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideAuth, getAuth, Auth, connectAuthEmulator } from '@angular/fire/auth';
import { provideFirestore, getFirestore, Firestore, connectFirestoreEmulator } from '@angular/fire/firestore';
import { provideStorage, getStorage, Storage, connectStorageEmulator } from '@angular/fire/storage';
import { environment } from "../environments/environment";
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';

function connectEmulatorsIfNeededFactory() {
  return () => {
    if (!environment.production && environment.useEmulators !== false) {
      const auth = inject(Auth);
      const fs = inject(Firestore);
      const storage = inject(Storage);

      connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
      connectFirestoreEmulator(fs, 'localhost', 8080);
      connectStorageEmulator(storage, 'localhost', 9199);
    }
  };
}

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
          preset: Aura,
          options: {
            darkModeSelector: false || 'none'
        }
      }
  }),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),

    // Ensure emulator connections happen before the app starts using the services
    {
      provide: APP_INITIALIZER,
      useFactory: connectEmulatorsIfNeededFactory,
      multi: true
    }
  ],
};
