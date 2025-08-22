"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const storage_1 = require("@angular/fire/storage");
async function uploadUserFile(storage, uid, file) {
    const r = (0, storage_1.ref)(storage, `users/${uid}/uploads/${Date.now()}_${file.name}`);
    await (0, storage_1.uploadBytes)(r, file);
    return (0, storage_1.getDownloadURL)(r);
}
