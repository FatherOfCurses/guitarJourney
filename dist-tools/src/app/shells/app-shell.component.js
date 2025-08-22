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
exports.AppShellComponent = void 0;
const core_1 = require("@angular/core");
const router_1 = require("@angular/router");
const menubar_1 = require("primeng/menubar");
const tieredmenu_1 = require("primeng/tieredmenu");
const button_1 = require("primeng/button");
const auth_1 = require("@angular/fire/auth");
let AppShellComponent = (() => {
    let _classDecorators = [(0, core_1.Component)({
            selector: 'app-shell',
            standalone: true,
            imports: [router_1.RouterOutlet, menubar_1.MenubarModule, tieredmenu_1.TieredMenuModule, button_1.ButtonModule],
            templateUrl: './app-shell.component.html',
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _userMenu_decorators;
    let _userMenu_initializers = [];
    let _userMenu_extraInitializers = [];
    var AppShellComponent = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _userMenu_decorators = [(0, core_1.ViewChild)('userMenu')];
            __esDecorate(null, null, _userMenu_decorators, { kind: "field", name: "userMenu", static: false, private: false, access: { has: obj => "userMenu" in obj, get: obj => obj.userMenu, set: (obj, value) => { obj.userMenu = value; } }, metadata: _metadata }, _userMenu_initializers, _userMenu_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            AppShellComponent = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        userMenu = __runInitializers(this, _userMenu_initializers, void 0);
        // Top-level nav
        items = (__runInitializers(this, _userMenu_extraInitializers), (0, core_1.signal)([
            { label: 'Sessions', icon: 'pi pi-clock', routerLink: ['/sessions'] },
            { label: 'Songs', icon: 'pi pi-music', routerLink: ['/songs'] },
            { label: 'Metrics', icon: 'pi pi-chart-bar', routerLink: ['/metrics'] },
        ]));
        // User dropdown items
        userItems = (0, core_1.signal)([
            { label: 'My Profile', icon: 'pi pi-user', routerLink: ['/profile'] },
            { label: 'Settings', icon: 'pi pi-cog', routerLink: ['/settings'] },
            { separator: true },
            { label: 'Sign out', icon: 'pi pi-sign-out', command: () => this.onSignOut() },
        ]);
        auth = (0, core_1.inject)(auth_1.Auth);
        router = (0, core_1.inject)(router_1.Router);
        async onSignOut() {
            try {
                await (0, auth_1.signOut)(this.auth);
            }
            finally {
                this.router.navigate(['/']);
            }
        }
        toggleUserMenu(event) {
            this.userMenu.toggle(event);
        }
    };
    return AppShellComponent = _classThis;
})();
exports.AppShellComponent = AppShellComponent;
