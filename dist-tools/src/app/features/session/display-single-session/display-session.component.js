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
exports.DisplaySessionComponent = void 0;
const core_1 = require("@angular/core");
const common_1 = require("@angular/common");
const router_1 = require("@angular/router");
const rxjs_interop_1 = require("@angular/core/rxjs-interop");
const rxjs_1 = require("rxjs");
const session_service_1 = require("../../../services/session.service");
const button_1 = require("primeng/button");
const card_1 = require("primeng/card");
let DisplaySessionComponent = (() => {
    let _classDecorators = [(0, core_1.Component)({
            selector: 'app-display-single-session',
            standalone: true,
            imports: [common_1.CommonModule, button_1.ButtonModule, card_1.CardModule],
            templateUrl: './display-session.component.html',
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var DisplaySessionComponent = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            DisplaySessionComponent = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        router = (0, core_1.inject)(router_1.Router);
        route = (0, core_1.inject)(router_1.ActivatedRoute);
        sessionService = (0, core_1.inject)(session_service_1.SessionService);
        // route param as a signal
        sessionId = (0, rxjs_interop_1.toSignal)(this.route.paramMap.pipe((0, rxjs_1.map)(pm => pm.get('id')), (0, rxjs_1.filter)((id) => !!id)), { initialValue: null });
        // session data as a signal (auto-updates when id changes)
        session = (0, rxjs_interop_1.toSignal)(this.route.paramMap.pipe((0, rxjs_1.map)(pm => pm.get('id')), (0, rxjs_1.filter)((id) => !!id), (0, rxjs_1.switchMap)(id => this.sessionService.getSession$(id)), (0, rxjs_1.catchError)(() => (0, rxjs_1.of)(null))), { initialValue: null });
        loading = (0, core_1.computed)(() => this.session() === null && this.sessionId() !== null);
        hasError = (0, core_1.computed)(() => this.sessionId() !== null && this.session() === null);
        returnToTable() {
            this.router.navigate(['/sessions']);
        }
    };
    return DisplaySessionComponent = _classThis;
})();
exports.DisplaySessionComponent = DisplaySessionComponent;
