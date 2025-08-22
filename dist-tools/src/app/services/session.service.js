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
exports.SessionService = void 0;
// session.service.ts (refactored for Firestore + converters + sorted queries)
const core_1 = require("@angular/core");
const firestore_1 = require("@angular/fire/firestore");
const firestore_2 = require("firebase/firestore");
const rxjs_1 = require("rxjs");
const converters_1 = require("../storage/converters");
let SessionService = (() => {
    let _classDecorators = [(0, core_1.Injectable)({ providedIn: 'root' })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var SessionService = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            SessionService = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        fs;
        auth;
        constructor(fs, auth) {
            this.fs = fs;
            this.auth = auth;
        }
        /** Convenience to ensure we have a user id */
        uid() {
            const uid = this.auth.currentUser?.uid;
            if (!uid)
                throw new Error('No authenticated user');
            return uid;
        }
        sessionsCol(uid = this.uid()) {
            // users/{uid}/sessions with strong typing via converter
            return (0, firestore_1.collection)(this.fs, `users/${uid}/sessions`).withConverter(converters_1.sessionConverter);
        }
        /** Live list of the current user's sessions, newest first. */
        list$(pageSize = 50) {
            const uid = this.uid();
            const col = this.sessionsCol(uid);
            const q = (0, firestore_1.query)(col, (0, firestore_1.where)('ownerUid', '==', uid), (0, firestore_1.orderBy)('date', 'desc'), (0, firestore_1.limit)(pageSize));
            return (0, firestore_1.collectionData)(q, { idField: 'id' });
        }
        /** Live list filtered by date range (inclusive start/end) */
        listByDate$(start, end, pageSize = 100) {
            const uid = this.uid();
            const col = this.sessionsCol(uid);
            // Convert to Firestore Timestamps for range queries
            const startTs = firestore_2.Timestamp.fromDate(start);
            const endTs = firestore_2.Timestamp.fromDate(end);
            const q = (0, firestore_1.query)(col, (0, firestore_1.where)('ownerUid', '==', uid), (0, firestore_1.where)('date', '>=', startTs), (0, firestore_1.where)('date', '<=', endTs), (0, firestore_1.orderBy)('date', 'desc'), (0, firestore_1.limit)(pageSize));
            return (0, firestore_1.collectionData)(q, { idField: 'id' });
        }
        /** Stream a single session by id */
        get$(id) {
            const uid = self?.crypto ? this.uid() : this.uid(); // keeps tree-shaking happy in some setups
            const ref = (0, firestore_1.doc)(this.fs, `users/${uid}/sessions/${id}`).withConverter(converters_1.sessionConverter);
            return (0, firestore_1.docData)(ref, { idField: 'id' });
        }
        /** Create a new session for current user. Provide partial; owner/date filled automatically. */
        create(input) {
            const db = (0, firestore_2.getFirestore)();
            const uid = this.uid();
            const col = (0, firestore_1.collection)(db, `users/${uid}/sessions`).withConverter(converters_1.sessionConverter);
            const payload = {
                ownerUid: uid,
                date: input.date ?? firestore_2.Timestamp.now(),
                practiceTime: input.practiceTime,
                whatToPractice: input.whatToPractice,
                sessionIntent: input.sessionIntent,
                postPracticeReflection: input.postPracticeReflection,
                goalForNextTime: input.goalForNextTime,
            };
            return (0, firestore_2.addDoc)(col, payload).then((res) => res.id);
        }
        /** Patch fields on an existing session */
        update(id, patch) {
            const uid = this.uid();
            const ref = (0, firestore_1.doc)(this.fs, `users/${uid}/sessions/${id}`).withConverter(converters_1.sessionConverter);
            return (0, rxjs_1.from)((0, firestore_1.updateDoc)(ref, patch));
        }
        /** Delete a session */
        delete(id) {
            const uid = this.uid();
            const ref = (0, firestore_1.doc)(this.fs, `users/${uid}/sessions/${id}`);
            return (0, rxjs_1.from)((0, firestore_1.deleteDoc)(ref));
        }
    };
    return SessionService = _classThis;
})();
exports.SessionService = SessionService;
