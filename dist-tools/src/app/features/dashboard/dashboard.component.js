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
exports.DashboardComponent = void 0;
// dashboard/dashboard.component.ts
const core_1 = require("@angular/core");
const router_1 = require("@angular/router");
let DashboardComponent = (() => {
    let _classDecorators = [(0, core_1.Component)({
            standalone: true,
            imports: [],
            template: './dashboard.component.html',
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var DashboardComponent = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            DashboardComponent = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        route = (0, core_1.inject)(router_1.ActivatedRoute);
        data = (0, core_1.signal)(this.route.snapshot.data['prefetch']);
        weekTotal = (0, core_1.signal)(this.data().recentMinutes.reduce((a, b) => a + b, 0));
        images = [
            '/assets/inspo/1.jpg',
            '/assets/inspo/2.jpg',
            '/assets/inspo/3.jpg',
        ];
        currentIdx = (0, core_1.signal)(0);
        currentImage = (0, core_1.signal)(this.images[0]);
        // simple rotation
        _rotate = (0, core_1.effect)(onCleanup => {
            const id = setInterval(() => {
                const next = (this.currentIdx() + 1) % this.images.length;
                this.currentIdx.set(next);
                this.currentImage.set(this.images[next]);
            }, 6000);
            onCleanup(() => clearInterval(id));
        });
    };
    return DashboardComponent = _classThis;
})();
exports.DashboardComponent = DashboardComponent;
