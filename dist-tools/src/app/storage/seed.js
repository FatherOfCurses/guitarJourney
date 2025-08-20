"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Seed the Firestore emulator with a test user, sessions, and songs
// Run with: node --loader ts-node/esm tools/seed.ts
const firestore_1 = require("firebase/firestore");
// Emulators ignore credentials when you pass only projectId
initializeApp({ projectId: 'demo-guitar-journey' });
const db = (0, firestore_1.getFirestore)();
async function seed(uid = 'test-user') {
    const userRef = (0, firestore_1.doc)(db, `users/${uid}`);
    await (0, firestore_1.setDoc)(userRef, {
        ownerUid: uid,
        displayName: 'Test User',
        createdAt: firestore_1.Timestamp.now(),
    });
    // Sessions under the user
    const sessionsCollection = (0, firestore_1.collection)(db, `users/${uid}/sessions`);
    await (0, firestore_1.setDoc)((0, firestore_1.doc)(sessionsCollection), {
        ownerUid: uid,
        date: firestore_1.Timestamp.now(),
        practiceTime: 30,
        whatToPractice: 'Pentatonic shapes',
        sessionIntent: 'Improve speed',
        postPracticeReflection: 'Felt good, need metronome',
        goalForNextTime: '+5 BPM',
    });
    await (0, firestore_1.setDoc)((0, firestore_1.doc)(sessionsCollection), {
        ownerUid: uid,
        date: firestore_1.Timestamp.fromDate(new Date(Date.now() - 24 * 3600 * 1000)),
        practiceTime: 20,
        whatToPractice: 'Chord changes',
        sessionIntent: 'Clean transitions',
        postPracticeReflection: 'Less buzzing',
        goalForNextTime: 'Add F#m shape',
    });
    // Songs (global)
    const songsCollection = (0, firestore_1.collection)(db, 'songs');
    await (0, firestore_1.setDoc)((0, firestore_1.doc)(songsCollection), {
        title: 'Blackbird',
        artist: 'The Beatles',
        genre: 'Folk',
        sortTitle: 'blackbird',
        sortArtist: 'the beatles',
    });
    await (0, firestore_1.setDoc)((0, firestore_1.doc)(songsCollection), {
        title: 'Creep',
        artist: 'Radiohead',
        genre: 'Rock',
        sortTitle: 'creep',
        sortArtist: 'radiohead',
    });
    console.log('Seed complete');
}
seed().then(() => process.exit(0));
