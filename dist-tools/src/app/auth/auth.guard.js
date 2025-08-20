"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authGuard = void 0;
// auth.guard.ts
const core_1 = require("@angular/core");
const router_1 = require("@angular/router");
const auth_1 = require("@angular/fire/auth");
const authGuard = async () => {
    const auth = (0, core_1.inject)(auth_1.Auth);
    const router = (0, core_1.inject)(router_1.Router);
    return new Promise(resolve => {
        const unsub = auth.onAuthStateChanged(user => {
            unsub();
            if (user)
                resolve(true);
            else {
                router.navigate(['/login']);
                resolve(false);
            }
        });
    });
};
exports.authGuard = authGuard;
