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
exports.RegisterComponent = void 0;
const core_1 = require("@angular/core");
const common_1 = require("@angular/common");
const router_1 = require("@angular/router");
const forms_1 = require("@angular/forms");
const auth_1 = require("@angular/fire/auth");
// PrimeNG
const inputtext_1 = require("primeng/inputtext");
const password_1 = require("primeng/password");
const button_1 = require("primeng/button");
const divider_1 = require("primeng/divider");
const message_1 = require("primeng/message");
function matchPasswords(ctrl) {
    const pwd = ctrl.get('password')?.value;
    const cfm = ctrl.get('confirmPassword')?.value;
    return pwd && cfm && pwd !== cfm ? { passwordsDontMatch: true } : null;
}
let RegisterComponent = (() => {
    let _classDecorators = [(0, core_1.Component)({
            standalone: true,
            selector: 'app-register',
            templateUrl: './register.component.html',
            imports: [
                common_1.CommonModule, forms_1.ReactiveFormsModule, router_1.RouterLink,
                inputtext_1.InputTextModule, password_1.PasswordModule, button_1.ButtonModule, divider_1.DividerModule, message_1.MessageModule
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var RegisterComponent = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            RegisterComponent = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        auth;
        router;
        fb;
        // template state
        loading = (0, core_1.signal)(false);
        error = (0, core_1.signal)(null);
        form;
        constructor(auth, router, fb) {
            this.auth = auth;
            this.router = router;
            this.fb = fb;
            this.form = this.fb.group({
                displayName: new forms_1.FormControl('', { nonNullable: true, validators: [forms_1.Validators.maxLength(80)] }),
                email: new forms_1.FormControl('', { nonNullable: true, validators: [forms_1.Validators.required, forms_1.Validators.email] }),
                password: new forms_1.FormControl('', { nonNullable: true, validators: [forms_1.Validators.required, forms_1.Validators.minLength(8)] }),
                confirmPassword: new forms_1.FormControl('', { nonNullable: true, validators: [forms_1.Validators.required] }),
            }, { validators: matchPasswords });
            (0, auth_1.onAuthStateChanged)(this.auth, u => { if (u)
                this.router.navigate(['/app']); });
        }
        get displayName() { return this.form.controls.displayName; }
        get email() { return this.form.controls.email; }
        get password() { return this.form.controls.password; }
        get confirmPassword() { return this.form.controls.confirmPassword; }
        async submit() {
            if (this.form.invalid) {
                this.form.markAllAsTouched();
                return;
            }
            this.loading.set(true);
            this.error.set(null);
            const { email, password, displayName } = this.form.value;
            try {
                const cred = await (0, auth_1.createUserWithEmailAndPassword)(this.auth, email, password);
                if (displayName) {
                    await (0, auth_1.updateProfile)(cred.user, { displayName: displayName });
                }
                await this.router.navigate(['/app']);
            }
            catch (e) {
                const msg = e?.code === 'auth/email-already-in-use' ? 'That email is already in use.' :
                    e?.code === 'auth/weak-password' ? 'Please choose a stronger password (8+ characters).' :
                        e?.code === 'auth/invalid-email' ? 'Please enter a valid email address.' :
                            'Could not create your account. Please try again.';
                this.error.set(msg);
                console.error(e);
            }
            finally {
                this.loading.set(false);
            }
        }
        async google() {
            this.loading.set(true);
            this.error.set(null);
            try {
                await (0, auth_1.signInWithPopup)(this.auth, new auth_1.GoogleAuthProvider());
                await this.router.navigate(['/app']);
            }
            catch (e) {
                this.error.set('Google sign-in failed. Please try again.');
                console.error(e);
            }
            finally {
                this.loading.set(false);
            }
        }
    };
    return RegisterComponent = _classThis;
})();
exports.RegisterComponent = RegisterComponent;
