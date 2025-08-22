"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appConfig = void 0;
// app.config.ts
const core_1 = require("@angular/core");
const router_1 = require("@angular/router");
const animations_1 = require("@angular/platform-browser/animations");
const http_1 = require("@angular/common/http");
const routes_1 = require("./routes");
const app_1 = require("@angular/fire/app");
const auth_1 = require("@angular/fire/auth");
const firestore_1 = require("@angular/fire/firestore");
const storage_1 = require("@angular/fire/storage");
const environment_1 = require("../environments/environment");
const config_1 = require("primeng/config");
const aura_1 = __importDefault(require("@primeuix/themes/aura"));
function connectEmulatorsIfNeededFactory() {
    return () => {
        if (!environment_1.environment.production && environment_1.environment.useEmulators !== false) {
            const auth = (0, core_1.inject)(auth_1.Auth);
            const fs = (0, core_1.inject)(firestore_1.Firestore);
            const storage = (0, core_1.inject)(storage_1.Storage);
            (0, auth_1.connectAuthEmulator)(auth, 'http://localhost:9099', { disableWarnings: true });
            (0, firestore_1.connectFirestoreEmulator)(fs, 'localhost', 8080);
            (0, storage_1.connectStorageEmulator)(storage, 'localhost', 9199);
        }
    };
}
exports.appConfig = {
    providers: [
        (0, router_1.provideRouter)(routes_1.routes, (0, router_1.withComponentInputBinding)(), (0, router_1.withInMemoryScrolling)({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }), (0, router_1.withViewTransitions)()),
        (0, animations_1.provideAnimations)(),
        (0, http_1.provideHttpClient)(),
        (0, config_1.providePrimeNG)({
            theme: {
                preset: aura_1.default,
                options: {
                    darkModeSelector: false || 'none'
                }
            }
        }),
        (0, app_1.provideFirebaseApp)(() => (0, app_1.initializeApp)(environment_1.environment.firebase)),
        (0, auth_1.provideAuth)(() => (0, auth_1.getAuth)()),
        (0, firestore_1.provideFirestore)(() => (0, firestore_1.getFirestore)()),
        (0, storage_1.provideStorage)(() => (0, storage_1.getStorage)()),
        // Ensure emulator connections happen before the app starts using the services
        {
            provide: core_1.APP_INITIALIZER,
            useFactory: connectEmulatorsIfNeededFactory,
            multi: true
        }
    ],
};
