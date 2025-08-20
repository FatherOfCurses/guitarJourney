"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const public_shell_component_1 = require("./shells/public-shell.component");
const app_shell_component_1 = require("./shells/app-shell.component");
const auth_guard_1 = require("./auth/auth.guard");
const already_authed_guard_1 = require("./auth/already-authed.guard");
exports.routes = [
    // PUBLIC AREA
    {
        path: '',
        component: public_shell_component_1.PublicShellComponent,
        children: [
            {
                path: '',
                loadComponent: () => Promise.resolve().then(() => __importStar(require('./welcome/welcome.component'))).then(m => m.WelcomeComponent),
                title: 'Guitar Journey',
            },
            {
                path: 'login',
                canActivate: [already_authed_guard_1.AlreadyAuthedGuard],
                loadComponent: () => Promise.resolve().then(() => __importStar(require('./auth/login.component'))).then(m => m.LoginComponent),
                title: 'Sign in',
            },
            {
                path: 'register',
                loadComponent: () => Promise.resolve().then(() => __importStar(require('./auth/register.component'))).then(m => m.RegisterComponent),
            }
        ],
    },
    // PRIVATE AREA
    {
        path: 'app',
        component: app_shell_component_1.AppShellComponent, // your existing shell (top nav)
        canActivate: [auth_guard_1.authGuard],
        children: [
            {
                path: '',
                pathMatch: 'full',
                loadComponent: () => Promise.resolve().then(() => __importStar(require('./core/home/home.component'))).then(m => m.HomeComponent),
                title: 'Welcome',
            },
            {
                path: 'sessions',
                loadComponent: () => Promise.resolve().then(() => __importStar(require('./features/session/session.component'))).then(m => m.SessionComponent),
            },
            {
                path: 'songs',
                loadComponent: () => Promise.resolve().then(() => __importStar(require('./features/songs/songs.component'))).then(m => m.SongsComponent),
            },
            {
                path: 'metrics',
                loadComponent: () => Promise.resolve().then(() => __importStar(require('./features/metrics/metrics.component'))).then(m => m.MetricsComponent),
            },
        ],
    },
    // Fallback
    { path: '**', redirectTo: '' },
];
