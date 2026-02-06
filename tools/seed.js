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

/**
 * Auto-generated carousel seed script
 * Generated from: Carousel Photos Google Sheet
 * Date: 2026-02-06T15:12:43.514Z
 * Total items: 13
 */

const admin = require('firebase-admin');

process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';

const carouselItems = [
  {
    "position": 1,
    "alt": "Close up of electric guitar being played outdoors",
    "image": {
      "url": "/assets/carousel/2467308300.jpg",
      "width": 3488,
      "height": 2616
    },
    "attribution": {
      "title": "Electric Guitar",
      "creatorName": "Gabriel Pollard",
      "creatorUrl": "https://www.flickr.com/photos/nzgabriel/",
      "sourceName": "Openverse",
      "sourceUrl": "https://openverse.org/image/ba9607fc-9faf-406e-ab90-15b707d6643b",
      "license": "CC BY 2.0",
      "licenseUrl": "https://creativecommons.org/licenses/by/2.0",
      "originalFileUrl": "https://www.flickr.com/photos/61181002@N00/2467308300"
    }
  },
  {
    "position": 2,
    "alt": "Female guitar player Eruca Sativa playing onstage at La Trastienda Montevideo",
    "image": {
      "url": "/assets/carousel/25294826140.jpg",
      "width": 4592,
      "height": 3064
    },
    "attribution": {
      "title": "Eruca Sativa @ La Trastienda Montevideo (2016-03-05)",
      "creatorName": "Lula Bertoldi",
      "creatorUrl": "https://www.flickr.com/photos/el_nando/",
      "sourceName": "Openverse",
      "sourceUrl": "https://openverse.org/image/8cabcd22-a74b-4f8b-a01c-0e9272461b06",
      "license": "CC BY-NC-SA 2.0",
      "licenseUrl": "CC BY-NC-SA 2.0",
      "originalFileUrl": "https://www.flickr.com/photos/49273060@N04/25294826140"
    }
  },
  {
    "position": 3,
    "alt": "Female playing acoustic guitar and busking in 1970s Seattle",
    "image": {
      "url": "/assets/carousel/2655556373.gif",
      "width": 815,
      "height": 1200
    },
    "attribution": {
      "title": "Guitar Player at Corner Market paint-in, 1975",
      "creatorName": "Seattle Municipal Archives",
      "creatorUrl": "https://www.flickr.com/photos/seattlemunicipalarchives/",
      "sourceName": "Openverse",
      "sourceUrl": "https://openverse.org/image/d74f1f9a-2267-4e11-aaaf-43a719823813",
      "license": "CC BY 2.0",
      "licenseUrl": "https://creativecommons.org/licenses/by/2.0",
      "originalFileUrl": "https://www.flickr.com/photos/24256351@N04/2655556373"
    }
  },
  {
    "position": 4,
    "alt": "Female 80's guitar player on stage with red guitar",
    "image": {
      "url": "/assets/carousel/3559884142.jpg",
      "width": 1221,
      "height": 2705
    },
    "attribution": {
      "title": "English girl guitar player (probably Ana da Silva of The Raincoats) Market St. Theater, 1981, San Francisco",
      "creatorName": "Steve Harlow",
      "creatorUrl": "https://www.flickr.com/photos/p0ps/",
      "sourceName": "Openverse",
      "sourceUrl": "https://openverse.org/image/54f1653a-b096-4146-b2db-50042b71b114",
      "license": "CC BY-NC-SA 2.0",
      "licenseUrl": "CC BY-NC-SA 2.0",
      "originalFileUrl": "https://www.flickr.com/photos/23642817@N00/3559884142"
    }
  },
  {
    "position": 5,
    "alt": "Male guitar player playing acoustic guitar with capo",
    "image": {
      "url": "/assets/carousel/4773159075.jpg",
      "width": 2387,
      "height": 2592
    },
    "attribution": {
      "title": "Guitar Player (Matthew Lennox)",
      "creatorName": "Al-Janabi",
      "creatorUrl": "https://www.flickr.com/photos/aljanabi/",
      "sourceName": "Openverse",
      "sourceUrl": "https://openverse.org/image/a1f77602-a1cb-4a54-9ae2-0030721443ae",
      "license": "CC BY-NC-ND 2.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-nc-nd/2.0/?ref=openverse",
      "originalFileUrl": "https://www.flickr.com/photos/51374494@N08/4773159075"
    }
  },
  {
    "position": 6,
    "alt": "Close-up of very worn electric guitar neck being played outdoors",
    "image": {
      "url": "/assets/carousel/5788179259.jpg",
      "width": 1280,
      "height": 960
    },
    "attribution": {
      "title": "_5210958 Guitar Player",
      "creatorName": "Archie Gleason",
      "creatorUrl": "https://www.flickr.com/photos/11286337@N04/",
      "sourceName": "Openverse",
      "sourceUrl": "https://openverse.org/image/8cabcd22-a74b-4f8b-a01c-0e9272461b06",
      "license": "CC BY-ND 2.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-nd/2.0/",
      "originalFileUrl": "https://www.flickr.com/photos/11286337@N04/5788179259"
    }
  },
  {
    "position": 7,
    "alt": "Close up of electric guitar being played",
    "image": {
      "url": "/assets/carousel/6059241719.jpg",
      "width": 1024,
      "height": 683
    },
    "attribution": {
      "title": "Guitar Player",
      "creatorName": "nehad1",
      "creatorUrl": "https://www.flickr.com/photos/nehad1/",
      "sourceName": "Openverse",
      "sourceUrl": "https://openverse.org/image/daccd3ab-0be5-469e-8706-51e3cfad5cdd",
      "license": "CC BY-NC 2.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-nc/2.0/",
      "originalFileUrl": "https://www.flickr.com/photos/42275226@N04/6059241719"
    }
  },
  {
    "position": 8,
    "alt": "Shot from behind of female guitar player on stage at indoor club concert",
    "image": {
      "url": "/assets/carousel/9255147576.jpg",
      "width": 1563,
      "height": 2084
    },
    "attribution": {
      "title": "Guitar Player",
      "creatorName": "Bill Oriani",
      "creatorUrl": "https://www.flickr.com/photos/oriani/",
      "sourceName": "Openverse",
      "sourceUrl": "https://openverse.org/image/34f25c9b-2adb-4dc8-bcb6-8b0ec16b0411",
      "license": "CC BY-NC-SA 2.0",
      "licenseUrl": "CC BY-NC-SA 2.0",
      "originalFileUrl": "https://www.flickr.com/photos/24448461@N03/9255147576"
    }
  },
  {
    "position": 9,
    "alt": "Male guitar player in blue light on stage",
    "image": {
      "url": "/assets/carousel/10799727025.jpg",
      "width": 2880,
      "height": 1920
    },
    "attribution": {
      "title": "Guitar Player",
      "creatorName": "Yari Samoilov",
      "creatorUrl": "https://www.flickr.com/photos/yuri_samoilov/",
      "sourceName": "Openverse",
      "sourceUrl": "https://openverse.org/image/cd00e28a-17cc-4e78-a07f-153525dc06ff",
      "license": "CC BY 2.0",
      "licenseUrl": "https://creativecommons.org/licenses/by/2.0",
      "originalFileUrl": "https://www.flickr.com/photos/103414654@N05/10799727025"
    }
  },
  {
    "position": 10,
    "alt": "Close up of neck of electric guitar being played",
    "image": {
      "url": "/assets/carousel/16768286129.jpg",
      "width": 2048,
      "height": 1367
    },
    "attribution": {
      "title": "Guitar Player",
      "creatorName": "Jorg Schreier",
      "creatorUrl": "https://www.flickr.com/photos/schreierjo/",
      "sourceName": "Openverse",
      "sourceUrl": "https://openverse.org/image/e8f05e0d-1b6d-41c9-9921-a81f095d05c2",
      "license": "CC BY 2.0",
      "licenseUrl": "https://creativecommons.org/licenses/by/2.0",
      "originalFileUrl": "https://www.flickr.com/photos/84060207@N08/16768286129"
    }
  },
  {
    "position": 11,
    "alt": "Older African American Blues guitar player seated at club wall playing guitar",
    "image": {
      "url": "/assets/carousel/19082972614.jpg",
      "width": 1024,
      "height": 768
    },
    "attribution": {
      "title": "rooster - sooc",
      "creatorName": "BPPrice",
      "creatorUrl": "https://www.flickr.com/photos/bpprice/",
      "sourceName": "Openverse",
      "sourceUrl": "https://openverse.org/image/56eeb25f-c9b4-4a88-a8b3-1fbd5f0801f7",
      "license": "CC BY 2.0",
      "licenseUrl": "https://creativecommons.org/licenses/by/2.0",
      "originalFileUrl": "https://www.flickr.com/photos/73082817@N03/19082972614"
    }
  },
  {
    "position": 12,
    "alt": "Male guitar player with sunglasses and acoustic guitar striking a pose in a studio",
    "image": {
      "url": "/assets/carousel/20124097821.jpg",
      "width": 4425,
      "height": 7154
    },
    "attribution": {
      "title": "Gary, the Guitar Player",
      "creatorName": "Geoff Livingston",
      "creatorUrl": "https://www.flickr.com/photos/geoliv/",
      "sourceName": "Openverse",
      "sourceUrl": "https://openverse.org/image/d126cf01-4c22-4d68-8a3c-723a0853895e",
      "license": "CC BY-NC-SA 2.0",
      "licenseUrl": "CC BY-NC-SA 2.0",
      "originalFileUrl": "https://www.flickr.com/photos/9397412@N06/20124097821"
    }
  },
  {
    "position": 13,
    "alt": "Female guitar player playing acoustic guitar and busking outdoors",
    "image": {
      "url": "/assets/carousel/25244389315.jpg",
      "width": 1115,
      "height": 1597
    },
    "attribution": {
      "title": "City Songstress - Manchester",
      "creatorName": "SimplSam",
      "creatorUrl": "https://www.flickr.com/photos/simplsam/",
      "sourceName": "Openverse",
      "sourceUrl": "https://openverse.org/image/b921578b-db62-4ac3-8623-8f2089305abb",
      "license": "CC BY-NC-SA 2.0",
      "licenseUrl": "CC BY-NC-SA 2.0",
      "originalFileUrl": "https://www.flickr.com/photos/134000856@N06/25244389315"
    }
  }
];

// Add Firestore timestamps
carouselItems.forEach(item => {
  item.createdAt = admin.firestore.FieldValue.serverTimestamp();
  item.updatedAt = admin.firestore.FieldValue.serverTimestamp();
});

async function seedCarousel() {
  const carouselSlug = 'dashboard-hero';
  
  console.log(`🚀 Seeding carousel: ${carouselSlug}`);
  console.log(`   Total items: ${carouselItems.length}\n`);
  
  try {
    // Create carousel parent document
    await db.collection('carousels').doc(carouselSlug).set({
      name: 'Dashboard Hero Carousel',
      slug: carouselSlug,
      rotateMs: 6000,
      aspectRatio: '16/9',
      isActive: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    
    console.log('✅ Created carousel parent document');
    
    // Add carousel items
    const itemsRef = db.collection('carousels').doc(carouselSlug).collection('items');
    
    for (const item of carouselItems) {
      const docRef = await itemsRef.add(item);
      console.log(`✅ Item ${item.position}: "${item.attribution.title}"`);
      console.log(`   ID: ${docRef.id}`);
      console.log(`   File: ${item.image.url}\n`);
    }
    
    console.log('🎉 Carousel seeding complete!');
    console.log(`   Total items: ${carouselItems.length}`);
    console.log('\n📍 View in Emulator UI: http://localhost:4000/firestore\n');
    
  } catch (error) {
    console.error('❌ Error seeding carousel:', error);
    throw error;
  }
}

// Run the seed function
seedCarousel()
  .then(() => {
    console.log('✅ Done!');
    console.log('   Start your app: npm start');
    console.log('   Navigate to: /app/dashboard\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });


main().catch((err) => {
  console.error(err)
  process.exit(1)
})