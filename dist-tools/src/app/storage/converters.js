"use strict";
// Strongly typed Firestore converters based on your models
Object.defineProperty(exports, "__esModule", { value: true });
exports.userDocumentConverter = exports.songConverter = exports.sessionConverter = void 0;
exports.sessionConverter = {
    toFirestore: (s) => ({
        ownerUid: s.ownerUid,
        date: s.date,
        practiceTime: s.practiceTime,
        whatToPractice: s.whatToPractice ?? null,
        sessionIntent: s.sessionIntent ?? null,
        postPracticeReflection: s.postPracticeReflection ?? null,
        goalForNextTime: s.goalForNextTime ?? null
    }),
    fromFirestore: (snap) => ({ id: snap.id, ...snap.data() }),
};
exports.songConverter = {
    toFirestore: (s) => ({
        title: s.title,
        artist: s.artist,
        genre: s.genre ?? null,
        appleMusicLink: s.appleMusicLink ?? null,
        spotifyLink: s.spotifyLink ?? null,
        sortTitle: (s.sortTitle ?? s.title).toLowerCase(),
        sortArtist: (s.sortArtist ?? s.artist).toLowerCase()
    }),
    fromFirestore: (snap) => ({ id: snap.id, ...snap.data() }),
};
exports.userDocumentConverter = {
    toFirestore: (d) => ({
        ownerUid: d.ownerUid,
        title: d.title,
        description: d.description ?? null,
        storagePath: d.storagePath
    }),
    fromFirestore: (snap) => ({ id: snap.id, ...snap.data() }),
};
