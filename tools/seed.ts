// Seed the Firestore emulator with a test user, sessions, and songs
// Run with: node --loader ts-node/esm tools/seed.ts
import {
  getFirestore,
  Timestamp,
  doc,
  collection,
  setDoc,
} from 'firebase/firestore'
import { initializeApp } from 'firebase/app'

// Emulators ignore credentials when you pass only projectId
initializeApp({ projectId: 'demo-guitar-journey' })
const db = getFirestore()

async function seed(uid = 'test-user') {
  const userRef = doc(db, `users/${uid}`)
  await setDoc(userRef, {
    ownerUid: uid,
    displayName: 'Test User',
    createdAt: Timestamp.now(),
  })

  // Sessions under the user
  const sessionsCollection = collection(db, `users/${uid}/sessions`)
  await setDoc(doc(sessionsCollection), {
    ownerUid: uid,
    date: Timestamp.now(),
    practiceTime: 30,
    whatToPractice: 'Pentatonic shapes',
    sessionIntent: 'Improve speed',
    postPracticeReflection: 'Felt good, need metronome',
    goalForNextTime: '+5 BPM',
  })
  await setDoc(doc(sessionsCollection), {
    ownerUid: uid,
    date: Timestamp.fromDate(new Date(Date.now() - 24 * 3600 * 1000)),
    practiceTime: 20,
    whatToPractice: 'Chord changes',
    sessionIntent: 'Clean transitions',
    postPracticeReflection: 'Less buzzing',
    goalForNextTime: 'Add F#m shape',
  })

  // Songs (global)
  const songsCollection = collection(db, 'songs')
  await setDoc(doc(songsCollection), {
    title: 'Blackbird',
    artist: 'The Beatles',
    genre: 'Folk',
    sortTitle: 'blackbird',
    sortArtist: 'the beatles',
  })
  await setDoc(doc(songsCollection), {
    title: 'Creep',
    artist: 'Radiohead',
    genre: 'Rock',
    sortTitle: 'creep',
    sortArtist: 'radiohead',
  })

  console.log('Seed complete')
}

seed().then(() => process.exit(0))
