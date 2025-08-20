
// Seed script for Firebase Emulators (Auth + Firestore)
// Usage (with emulators running or via emulators:exec):
//   GOOGLE_CLOUD_PROJECT=guitar-journey-b3295 \
//   FIRESTORE_EMULATOR_HOST=localhost:8080 \
//   FIREBASE_AUTH_EMULATOR_HOST=localhost:9099 \
//   node ./dist-tools/seed.js
//
// Idempotent: users are ensured; songs and sessions use fixed ids or merge writes.

const { initializeApp } = require('firebase-admin/app');
const { getFirestore, Timestamp } = require('firebase-admin/firestore');
const { getAuth } = require('firebase-admin/auth');

// Resolve projectId from env / emulator, fallback to your real project id
const projectId =
  process.env.GOOGLE_CLOUD_PROJECT ||
  (process.env.FIREBASE_CONFIG ? JSON.parse(process.env.FIREBASE_CONFIG).projectId : undefined) ||
  'guitar-journey-b3295';

initializeApp({ projectId });
const db = getFirestore();
const auth = getAuth();

function slugify(str) {
  return String(str).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

async function ensureEmailUser(email, displayName, password = 'Password123!') {
  try {
    const existing = await auth.getUserByEmail(email);
    return existing.uid;
  } catch (err) {
    if (err.code === 'auth/user-not-found') {
      const created = await auth.createUser({
        email,
        displayName,
        password,
        emailVerified: true,
      });
      return created.uid;
    }
    throw err;
  }
}

async function ensureGoogleUser(email, displayName, providerUid) {
  // Try get by email first
  try {
    const existing = await auth.getUserByEmail(email);
    return existing.uid;
  } catch (err) {
    if (err.code !== 'auth/user-not-found') throw err;
  }
  // Import as a Google provider user (no password)
  const record = {
    uid: providerUid,
    displayName,
    email,
    emailVerified: true,
    providerData: [
      {
        providerId: 'google.com',
        uid: providerUid,
        email,
        displayName,
      },
    ],
  };
  const result = await auth.importUsers([record], { hash: undefined });
  if (result.errors && result.errors.length) {
    const e = result.errors[0];
    throw new Error(`Failed to import Google user ${email}: ${e.error.toString()}`);
  }
  return providerUid;
}

async function upsertUserDoc(uid, displayName) {
  await db.doc(`users/${uid}`).set(
    {
      ownerUid: uid,
      displayName,
      createdAt: Timestamp.now(),
    },
    { merge: true }
  );
}

// 20-song catalog
const SONGS = [
  ['Blackbird', 'The Beatles', 'Folk'],
  ['Creep', 'Radiohead', 'Rock'],
  ['Hallelujah', 'Leonard Cohen', 'Folk'],
  ['Wish You Were Here', 'Pink Floyd', 'Rock'],
  ['Hotel California', 'Eagles', 'Rock'],
  ['Tears in Heaven', 'Eric Clapton', 'Soft Rock'],
  ['Nothing Else Matters', 'Metallica', 'Rock'],
  ['Hey There Delilah', 'Plain White T\'s', 'Pop'],
  ['Fast Car', 'Tracy Chapman', 'Folk'],
  ['Wonderwall', 'Oasis', 'Britpop'],
  ['Scarborough Fair', 'Traditional', 'Folk'],
  ['Yesterday', 'The Beatles', 'Pop'],
  ['Shape of My Heart', 'Sting', 'Pop'],
  ['More Than Words', 'Extreme', 'Acoustic Rock'],
  ['Landslide', 'Fleetwood Mac', 'Folk Rock'],
  ['Imagine', 'John Lennon', 'Pop'],
  ['Hurt', 'Johnny Cash', 'Country'],
  ['High and Dry', 'Radiohead', 'Alt Rock'],
  ['The Scientist', 'Coldplay', 'Pop Rock'],
  ['The A Team', 'Ed Sheeran', 'Pop'],
];

async function seedSongs() {
  const batch = db.batch();
  for (const [title, artist, genre] of SONGS) {
    const id = slugify(`${title}-${artist}`);
    const ref = db.doc(`songs/${id}`);
    batch.set(ref, {
      title,
      artist,
      genre,
      sortTitle: title.toLowerCase(),
      sortArtist: artist.toLowerCase(),
    }, { merge: true });
  }
  await batch.commit();
}

// Helpers for sessions
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFrom(arr) {
  return arr[randomInt(0, arr.length - 1)];
}

const WHAT_TO_PRACTICE = [
  'Pentatonic shapes',
  'Chord changes (G–D–Em–C)',
  'Fingerstyle pattern PIMA',
  'Barre chords (F, Bm)',
  'Alternate picking with metronome',
  '12-bar blues in A',
  'Major scale in C up the neck',
  'Rhythm strumming patterns',
  'Arpeggios over I–V–vi–IV',
  'Hammer-ons and pull-offs drills',
];

const INTENTS = [
  'Improve speed',
  'Clean transitions',
  'Strengthen fretting hand',
  'Timing with metronome',
  'Memorize shapes',
  'Improve tone and dynamics',
];

const REFLECTIONS = [
  'Felt good, need metronome work',
  'Left hand cramped, take breaks',
  'Cleaner sound after warming up',
  'Tempo drifted—use click next time',
  'Tone improved with lighter touch',
  'Still buzzing on barre chords',
];

const NEXT_GOALS = [
  '+5 BPM',
  'Add F#m shape',
  'Memorize Verse 1 riff',
  'Record and review posture',
  'Practice with backing track',
  'Focus on muting unused strings',
];

function randomTimestampBetween(startDate, endDate) {
  const startMs = startDate.getTime();
  const endMs = endDate.getTime();
  const t = new Date(randomInt(startMs, endMs));
  return Timestamp.fromDate(t);
}

async function seedSessions(uids) {
  // 50 total sessions, round-robin among the provided uids
  const start = new Date('2025-01-01T00:00:00Z');
  const end = new Date(); // now
  const total = 50;

  // Precompute 50 random sessions
  const sessions = [];
  for (let i = 1; i <= total; i++) {
    const uid = uids[(i - 1) % uids.length];
    const id = `seed-${String(i).padStart(3, '0')}`;
    const date = randomTimestampBetween(start, end);
    const practiceTime = randomInt(10, 60); // minutes

    sessions.push({ uid, id, date, practiceTime });
  }

  // Write in chunks to avoid giant batch limits
  const chunkSize = 20;
  for (let i = 0; i < sessions.length; i += chunkSize) {
    const chunk = sessions.slice(i, i + chunkSize);
    const batch = db.batch();
    for (const s of chunk) {
      const ref = db.doc(`users/${s.uid}/sessions/${s.id}`);
      batch.set(ref, {
        ownerUid: s.uid,
        date: s.date,
        practiceTime: s.practiceTime,
        whatToPractice: randomFrom(WHAT_TO_PRACTICE),
        sessionIntent: randomFrom(INTENTS),
        postPracticeReflection: randomFrom(REFLECTIONS),
        goalForNextTime: randomFrom(NEXT_GOALS),
      }, { merge: true });
    }
    await batch.commit();
  }
}

async function main() {
  console.log('Seeding project:', projectId);
  console.log('FIRESTORE_EMULATOR_HOST:', process.env.FIRESTORE_EMULATOR_HOST);
  console.log('FIREBASE_AUTH_EMULATOR_HOST:', process.env.FIREBASE_AUTH_EMULATOR_HOST);

  // Create 4 users (2 Google, 2 Email)
  const [g1, g2] = await Promise.all([
    ensureGoogleUser('google1@example.com', 'Google User One', 'google-user-one'),
    ensureGoogleUser('google2@example.com', 'Google User Two', 'google-user-two'),
  ]);

  const [e1, e2] = await Promise.all([
    ensureEmailUser('email1@example.com', 'Email User One'),
    ensureEmailUser('email2@example.com', 'Email User Two'),
  ]);

  // Firestore user docs
  await Promise.all([
    upsertUserDoc(g1, 'Google User One'),
    upsertUserDoc(g2, 'Google User Two'),
    upsertUserDoc(e1, 'Email User One'),
    upsertUserDoc(e2, 'Email User Two'),
  ]);

  // Songs (20)
  await seedSongs();

  // Sessions (50 total, across all 4 uids)
  await seedSessions([g1, g2, e1, e2]);

  // Health check doc
  await db.doc('healthcheck/ping').set({ at: Timestamp.now() }, { merge: true });

  console.log('Seed complete.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
