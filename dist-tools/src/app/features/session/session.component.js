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
exports.SessionComponent = void 0;
const core_1 = require("@angular/core");
const common_1 = require("@angular/common");
const forms_1 = require("@angular/forms");
const router_1 = require("@angular/router");
const rxjs_interop_1 = require("@angular/core/rxjs-interop");
const rxjs_1 = require("rxjs");
const session_service_1 = require("../../services/session.service");
var SessionStatus;
(function (SessionStatus) {
    SessionStatus["Before"] = "Before";
    SessionStatus["During"] = "During";
    SessionStatus["After"] = "After";
    SessionStatus["Done"] = "Done";
})(SessionStatus || (SessionStatus = {}));
let SessionComponent = (() => {
    let _classDecorators = [(0, core_1.Component)({
            selector: 'app-session',
            standalone: true,
            imports: [common_1.CommonModule, forms_1.ReactiveFormsModule],
            template: `<!-- template omitted; logic-only refactor -->`,
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var SessionComponent = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            SessionComponent = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        fb = (0, core_1.inject)(forms_1.FormBuilder);
        router = (0, core_1.inject)(router_1.Router);
        destroyRef = (0, core_1.inject)(core_1.DestroyRef);
        sessions = (0, core_1.inject)(session_service_1.SessionService);
        // --- Forms ---
        beforeForm = this.fb.nonNullable.group({
            whatToPractice: ['', [forms_1.Validators.maxLength(2000)]],
            sessionIntent: ['', [forms_1.Validators.maxLength(500)]],
        });
        afterForm = this.fb.nonNullable.group({
            sessionReflection: ['', [forms_1.Validators.maxLength(2000)]],
            goalForNextTime: ['', [forms_1.Validators.maxLength(500)]],
        });
        // --- State ---
        status = (0, core_1.signal)(SessionStatus.Before);
        timerSub;
        startedAt = null; // epoch ms
        // Elapsed milliseconds while status === During
        elapsedMs = (0, core_1.signal)(0);
        elapsedMin = (0, core_1.computed)(() => Math.max(0, Math.round(this.elapsedMs() / 60000)));
        // --- Lifecycle helpers ---
        start() {
            if (this.status() !== SessionStatus.Before)
                return;
            this.status.set(SessionStatus.During);
            this.startedAt = Date.now();
            // tick every second
            this.timerSub?.unsubscribe();
            this.timerSub = (0, rxjs_1.interval)(1000)
                .pipe((0, rxjs_interop_1.takeUntilDestroyed)(this.destroyRef))
                .subscribe(() => {
                if (this.startedAt != null) {
                    this.elapsedMs.set(Date.now() - this.startedAt);
                }
            });
        }
        stop() {
            if (this.status() !== SessionStatus.During)
                return;
            this.status.set(SessionStatus.After);
            this.timerSub?.unsubscribe();
            this.timerSub = undefined;
        }
        async save() {
            // Build payload for SessionsService.create()
            // Session model uses Firestore Timestamp for `date`
            const pre = this.beforeForm.getRawValue();
            const post = this.afterForm.getRawValue();
            const practiceTime = this.elapsedMin(); // minutes (integer)
            const payload = {
                practiceTime,
                whatToPractice: (pre.whatToPractice ?? '').trim(),
                sessionIntent: (pre.sessionIntent ?? '').trim(),
                postPracticeReflection: (post.sessionReflection ?? '').trim(),
                goalForNextTime: (post.goalForNextTime ?? '').trim(),
                // date omitted → will default to now() inside the service
            };
            try {
                const id = await this.sessions.create(payload);
                this.status.set(SessionStatus.Done);
                // Navigate to detail or list as you prefer
                await this.router.navigate(['/sessions', id]);
            }
            catch (e) {
                console.error('Failed to save session', e);
                // Optionally surface an error state to the UI
            }
        }
        cancel() {
            this.timerSub?.unsubscribe();
            this.timerSub = undefined;
            this.status.set(SessionStatus.Before);
            this.elapsedMs.set(0);
            this.startedAt = null;
            this.beforeForm.reset({ whatToPractice: '', sessionIntent: '' });
            this.afterForm.reset({ sessionReflection: '', goalForNextTime: '' });
        }
    };
    return SessionComponent = _classThis;
})();
exports.SessionComponent = SessionComponent;
