"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
// src/app/auth/auth.service.ts
const core_1 = require("@angular/core");
const auth_1 = require("@angular/fire/auth");
let AuthService = (() => {
    let _classDecorators = [(0, core_1.Injectable)({ providedIn: 'root' })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var AuthService = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            AuthService = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        auth;
        _user = (0, core_1.signal)(null);
        /** Current Firebase user (signal) */
        user = (0, core_1.computed)(() => this._user());
        /** True if signed in */
        isAuthed = (0, core_1.computed)(() => this._user() !== null);
        constructor(auth) {
            this.auth = auth;
            (0, auth_1.onAuthStateChanged)(this.auth, (u) => this._user.set(u));
        }
        /** Google OAuth sign-in (popup) */
        signInWithGoogle() {
            return (0, auth_1.signInWithPopup)(this.auth, new auth_1.GoogleAuthProvider());
        }
        /** Email + password sign-in */
        signInWithEmail(email, password) {
            return (0, auth_1.signInWithEmailAndPassword)(this.auth, email, password);
        }
        /** Create account with email + password (optional displayName) */
        async registerWithEmail(email, password, displayName) {
            const cred = await (0, auth_1.createUserWithEmailAndPassword)(this.auth, email, password);
            if (displayName) {
                await (0, auth_1.updateProfile)(cred.user, { displayName });
                // onAuthStateChanged will update the signal automatically,
                // but we can also set it to reflect the displayName immediately:
                this._user.set({ ...cred.user });
            }
            return cred;
        }
        /** Send password reset email */
        sendPasswordReset(email) {
            return (0, auth_1.sendPasswordResetEmail)(this.auth, email);
        }
        /** Sign out */
        signOut() {
            return (0, auth_1.signOut)(this.auth);
        }
        /** Convenience getters */
        get uid() { return this._user()?.uid ?? null; }
        get displayName() { return this._user()?.displayName ?? null; }
        get email() { return this._user()?.email ?? null; }
        /** Fetch ID token (e.g., for calling your backend) */
        async idToken(forceRefresh = false) {
            const u = this._user();
            return u ? (0, auth_1.getIdToken)(u, forceRefresh) : null;
        }
    };
    return AuthService = _classThis;
})();
exports.AuthService = AuthService;
