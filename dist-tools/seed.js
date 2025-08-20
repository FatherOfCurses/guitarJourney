// Resilient seed script for Firebase Emulators (Auth + Firestore)
// - Waits for Auth + Firestore emulator readiness with retries
// - Idempotent seeding (fixed IDs or merge writes)
// - Generates: 4 users (2 Google, 2 Email), 20 songs, 50 sessions
//
// Usage example (with emulators running or via your dev script):
//   export GOOGLE_CLOUD_PROJECT=guitar-journey-b3295
//   export FIRESTORE_EMULATOR_HOST=localhost:8080
//   export FIREBASE_AUTH_EMULATOR_HOST=localhost:9099
//   node ./seed-with-retry.js
//
const { initializeApp } = require('firebase-admin/app')
const { getFirestore, Timestamp } = require('firebase-admin/firestore')
const { getAuth } = require('firebase-admin/auth')

const projectId =
  process.env.GOOGLE_CLOUD_PROJECT ||
  (process.env.FIREBASE_CONFIG
    ? JSON.parse(process.env.FIREBASE_CONFIG).projectId
    : undefined) ||
  'guitar-journey-b3295'

initializeApp({ projectId })
const db = getFirestore()
const auth = getAuth()

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

async function waitForAuth(maxMs = 20000, stepMs = 500) {
  const until = Date.now() + maxMs
  let attempt = 0
  while (Date.now() < until) {
    attempt++
    try {
      await auth.listUsers(1)
      console.log(`[seed] Auth emulator is ready (attempt ${attempt}).`)
      return
    } catch (e) {
      // auth emulator not ready yet
      await sleep(stepMs)
    }
  }
  throw new Error('Auth emulator did not become ready in time.')
}

async function waitForFirestore(maxMs = 20000, stepMs = 500) {
  const until = Date.now() + maxMs
  let attempt = 0
  while (Date.now() < until) {
    attempt++
    try {
      await db
        .doc('healthcheck/readiness')
        .set({ at: Timestamp.now() }, { merge: true })
      console.log(`[seed] Firestore emulator is ready (attempt ${attempt}).`)
      return
    } catch (e) {
      // gRPC UNAVAILABLE (14) or connection refused
      await sleep(stepMs)
    }
  }
  throw new Error('Firestore emulator did not become ready in time.')
}

function slugify(str) {
  return String(str)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

async function ensureEmailUser(email, displayName, password = 'Password123!') {
  try {
    const existing = await auth.getUserByEmail(email)
    return existing.uid
  } catch (err) {
    if (err.code === 'auth/user-not-found') {
      const created = await auth.createUser({
        email,
        displayName,
        password,
        emailVerified: true,
      })
      return created.uid
    }
    throw err
  }
}

async function ensureGoogleUser(email, displayName, providerUid) {
  try {
    const existing = await auth.getUserByEmail(email)
    return existing.uid
  } catch (err) {
    if (err.code !== 'auth/user-not-found') throw err
  }
  const record = {
    uid: providerUid,
    displayName,
    email,
    emailVerified: true,
    providerData: [
      { providerId: 'google.com', uid: providerUid, email, displayName },
    ],
  }
  const result = await auth.importUsers([record], { hash: undefined })
  if (result.errors && result.errors.length) {
    const e = result.errors[0]
    throw new Error(
      `Failed to import Google user ${email}: ${e.error.toString()}`,
    )
  }
  return providerUid
}

async function upsertUserDoc(uid, displayName) {
  await db
    .doc(`users/${uid}`)
    .set(
      { ownerUid: uid, displayName, createdAt: Timestamp.now() },
      { merge: true },
    )
}

const SONGS = [
  ['Blackbird', 'The Beatles', 'Folk'],
  ['Creep', 'Radiohead', 'Rock'],
  ['Hallelujah', 'Leonard Cohen', 'Folk'],
  ['Wish You Were Here', 'Pink Floyd', 'Rock'],
  ['Hotel California', 'Eagles', 'Rock'],
  ['Tears in Heaven', 'Eric Clapton', 'Soft Rock'],
  ['Nothing Else Matters', 'Metallica', 'Rock'],
  ['Hey There Delilah', "Plain White T's", 'Pop'],
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
]

async function seedSongs() {
  const batch = db.batch()
  for (const [title, artist, genre] of SONGS) {
    const id = slugify(`${title}-${artist}`)
    const ref = db.doc(`songs/${id}`)
    batch.set(
      ref,
      {
        title,
        artist,
        genre,
        sortTitle: title.toLowerCase(),
        sortArtist: artist.toLowerCase(),
      },
      { merge: true },
    )
  }
  await batch.commit()
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
function randomFrom(arr) {
  return arr[randomInt(0, arr.length - 1)]
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
]
const INTENTS = [
  'Improve speed',
  'Clean transitions',
  'Strengthen fretting hand',
  'Timing with metronome',
  'Memorize shapes',
  'Improve tone and dynamics',
]
const REFLECTIONS = [
  'Felt good, need metronome work',
  'Left hand cramped, take breaks',
  'Cleaner sound after warming up',
  'Tempo drifted—use click next time',
  'Tone improved with lighter touch',
  'Still buzzing on barre chords',
]
const NEXT_GOALS = [
  '+5 BPM',
  'Add F#m shape',
  'Memorize Verse 1 riff',
  'Record and review posture',
  'Practice with backing track',
  'Focus on muting unused strings',
]

function randomTimestampBetween(startDate, endDate) {
  const startMs = startDate.getTime()
  const endMs = endDate.getTime()
  const t = new Date(randomInt(startMs, endMs))
  return Timestamp.fromDate(t)
}

async function seedSessions(uids) {
  const start = new Date('2025-01-01T00:00:00Z')
  const end = new Date()
  const total = 50

  const sessions = []
  for (let i = 1; i <= total; i++) {
    const uid = uids[(i - 1) % uids.length]
    sessions.push({
      uid,
      id: `seed-${String(i).padStart(3, '0')}`,
      date: randomTimestampBetween(start, end),
      practiceTime: randomInt(10, 60),
    })
  }

  const chunkSize = 20
  for (let i = 0; i < sessions.length; i += chunkSize) {
    const chunk = sessions.slice(i, i + chunkSize)
    const batch = db.batch()
    for (const s of chunk) {
      const ref = db.doc(`users/${s.uid}/sessions/${s.id}`)
      batch.set(
        ref,
        {
          ownerUid: s.uid,
          date: s.date,
          practiceTime: s.practiceTime,
          whatToPractice: randomFrom(WHAT_TO_PRACTICE),
          sessionIntent: randomFrom(INTENTS),
          postPracticeReflection: randomFrom(REFLECTIONS),
          goalForNextTime: randomFrom(NEXT_GOALS),
        },
        { merge: true },
      )
    }
    await batch.commit()
  }
}

async function verify() {
  const usersSnap = await db.collection('users').get()
  const songsSnap = await db.collection('songs').get()
  // Aggregate sessions count across all users
  let sessionsCount = 0
  for (const u of usersSnap.docs) {
    const ss = await db.collection(`users/${u.id}/sessions`).get()
    sessionsCount += ss.size
  }
  console.log(
    `[seed] Users: ${usersSnap.size}, Songs: ${songsSnap.size}, Sessions: ${sessionsCount}`,
  )
}

async function main() {
  console.log('[seed] Project:', projectId)
  console.log(
    '[seed] FIRESTORE_EMULATOR_HOST:',
    process.env.FIRESTORE_EMULATOR_HOST,
  )
  console.log(
    '[seed] FIREBASE_AUTH_EMULATOR_HOST:',
    process.env.FIREBASE_AUTH_EMULATOR_HOST,
  )

  await waitForAuth()
  await waitForFirestore()

  const [g1, g2] = await Promise.all([
    ensureGoogleUser(
      'google1@example.com',
      'Google User One',
      'google-user-one',
    ),
    ensureGoogleUser(
      'google2@example.com',
      'Google User Two',
      'google-user-two',
    ),
  ])
  const [e1, e2] = await Promise.all([
    ensureEmailUser('email1@example.com', 'Email User One'),
    ensureEmailUser('email2@example.com', 'Email User Two'),
  ])

  await Promise.all([
    upsertUserDoc(g1, 'Google User One'),
    upsertUserDoc(g2, 'Google User Two'),
    upsertUserDoc(e1, 'Email User One'),
    upsertUserDoc(e2, 'Email User Two'),
  ])

  await seedSongs()
  await seedSessions([g1, g2, e1, e2])

  await db.doc('healthcheck/ping').set({ at: Timestamp.now() }, { merge: true })

  await verify()
  console.log('[seed] Done.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
