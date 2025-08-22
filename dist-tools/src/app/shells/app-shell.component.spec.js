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
const testing_1 = require("@angular/core/testing");
const platform_browser_1 = require("@angular/platform-browser");
const core_1 = require("@angular/core");
const router_1 = require("@angular/router");
const testing_2 = require("@angular/router/testing");
const app_shell_component_1 = require("./shells/app-shell.component");
/** ---- STUB PAGES (standalone) ---- */
let HomeStubComponent = (() => {
    let _classDecorators = [(0, core_1.Component)({ standalone: true, template: 'home' })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var HomeStubComponent = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            HomeStubComponent = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
    };
    return HomeStubComponent = _classThis;
})();
let SessionsStubComponent = (() => {
    let _classDecorators = [(0, core_1.Component)({ standalone: true, template: 'sessions' })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var SessionsStubComponent = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            SessionsStubComponent = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
    };
    return SessionsStubComponent = _classThis;
})();
let SongsStubComponent = (() => {
    let _classDecorators = [(0, core_1.Component)({ standalone: true, template: 'songs' })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var SongsStubComponent = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            SongsStubComponent = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
    };
    return SongsStubComponent = _classThis;
})();
let MetricsStubComponent = (() => {
    let _classDecorators = [(0, core_1.Component)({ standalone: true, template: 'metrics' })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var MetricsStubComponent = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            MetricsStubComponent = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
    };
    return MetricsStubComponent = _classThis;
})();
const routes = [
    { path: '', component: HomeStubComponent },
    { path: 'sessions', component: SessionsStubComponent },
    { path: 'songs', component: SongsStubComponent },
    { path: 'metrics', component: MetricsStubComponent },
];
describe('AppShellComponent', () => {
    let fixture;
    let router;
    let harness;
    beforeEach(async () => {
        await testing_1.TestBed.configureTestingModule({
            imports: [
                // Import the standalone shell directly
                app_shell_component_1.AppShellComponent,
            ],
            providers: [
                // Modern router testing setup
                (0, router_1.provideRouter)(routes),
            ],
        }).compileComponents();
        router = testing_1.TestBed.inject(router_1.Router);
        fixture = testing_1.TestBed.createComponent(app_shell_component_1.AppShellComponent);
        fixture.detectChanges();
        harness = await testing_2.RouterTestingHarness.create();
    });
    it('creates the shell component', () => {
        expect(fixture.componentInstance).toBeTruthy();
    });
    it('contains a router-outlet', () => {
        const outlet = fixture.debugElement.query(platform_browser_1.By.directive(router_1.RouterOutlet));
        expect(outlet).toBeTruthy();
    });
    it('navigates to each route and renders the correct page in the outlet', async () => {
        let page = await harness.navigateByUrl('/', HomeStubComponent);
        expect(page).toBeInstanceOf(HomeStubComponent);
        page = await harness.navigateByUrl('/sessions', SessionsStubComponent);
        expect(page).toBeInstanceOf(SessionsStubComponent);
        page = await harness.navigateByUrl('/songs', SongsStubComponent);
        expect(page).toBeInstanceOf(SongsStubComponent);
        page = await harness.navigateByUrl('/metrics', MetricsStubComponent);
        expect(page).toBeInstanceOf(MetricsStubComponent);
    });
    it('applies the routerLinkActive class to the matching link after navigation', async () => {
        await harness.navigateByUrl('/songs', SongsStubComponent);
        fixture.detectChanges();
        const songLinkDe = fixture.debugElement
            .queryAll(platform_browser_1.By.css('a[routerLink]'))
            .find(de => de.nativeElement.textContent?.trim() === 'Songs');
        expect(songLinkDe).toBeTruthy();
        const el = songLinkDe.nativeElement;
        expect(el.classList.contains('text-indigo-600')).toBe(true);
    });
});
