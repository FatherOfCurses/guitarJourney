// tools/seed.cjs
// CommonJS seed script for Firestore emulator (no TS/ESM loader needed)
const { initializeApp } = require('firebase-admin/app');
const { getFirestore, Timestamp } = require('firebase-admin/firestore');

// Use emulator if running via `firebase emulators:exec`, or set FIRESTORE_EMULATOR_HOST
const projectId = process.env.GCLOUD_PROJECT || process.env.FIREBASE_PROJECT || 'demo-guitar-journey';

initializeApp({ projectId });
const db = getFirestore();

async function seed(uid = 'test-user') {
  const userRef = db.doc(`users/${uid}`);
  await userRef.set({
    ownerUid: uid,
    displayName: 'Test User',
    createdAt: Timestamp.now(),
  });

  const sessions = db.collection(`users/${uid}/sessions`);
  await sessions.doc().set({
    ownerUid: uid,
    date: Timestamp.now(),
    practiceTime: 30,
    whatToPractice: 'Pentatonic shapes',
    sessionIntent: 'Improve speed',
    postPracticeReflection: 'Felt good, need metronome',
    goalForNextTime: '+5 BPM',
  });
  await sessions.doc().set({
    ownerUid: uid,
    date: Timestamp.fromDate(new Date(Date.now() - 24 * 3600 * 1000)),
    practiceTime: 20,
    whatToPractice: 'Chord changes',
    sessionIntent: 'Clean transitions',
    postPracticeReflection: 'Less buzzing',
    goalForNextTime: 'Add F#m shape',
  });

  const songs = db.collection('songs');
  await songs.doc().set({
    title: 'Blackbird',
    artist: 'The Beatles',
    genre: 'Folk',
    sortTitle: 'blackbird',
    sortArtist: 'the beatles',
  });
  await songs.doc().set({
    title: 'Creep',
    artist: 'Radiohead',
    genre: 'Rock',
    sortTitle: 'creep',
    sortArtist: 'radiohead',
  });

  console.log('Seed complete');
}

seed().then(() => process.exit(0)).catch((err) => {
  console.error(err);
  process.exit(1);
});
