"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SongsService = void 0;
// songs.service.ts (sketch)
const firestore_1 = require("firebase/firestore");
const converters_1 = require("../storage/converters");
const lite_1 = require("@angular/fire/firestore/lite");
class SongsService {
    db = (0, firestore_1.getFirestore)();
    list(pageSize = 100) {
        const col = (0, firestore_1.collection)(this.db, 'songs').withConverter(converters_1.songConverter);
        const q = (0, firestore_1.query)(col, (0, firestore_1.orderBy)('title'), (0, firestore_1.orderBy)('artist'), (0, firestore_1.limit)(pageSize));
        return (0, lite_1.collectionData)(q, { idField: 'id' });
    }
}
exports.SongsService = SongsService;
