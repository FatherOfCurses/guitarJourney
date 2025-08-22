// Strongly typed Firestore converters based on your models

import { FirestoreDataConverter, Timestamp } from 'firebase/firestore';

export interface Session {
  id?: string;
  ownerUid: string;
  date: Timestamp;           // Firestore Timestamp for proper sorting
  practiceTime: number;      // minutes
  whatToPractice?: string;
  sessionIntent?: string;
  postPracticeReflection?: string;
  goalForNextTime?: string;
}

export const sessionConverter: FirestoreDataConverter<Session> = {
  toFirestore: (s) => ({
    ownerUid: s.ownerUid,
    date: s.date,
    practiceTime: s.practiceTime,
    whatToPractice: s.whatToPractice ?? null,
    sessionIntent: s.sessionIntent ?? null,
    postPracticeReflection: s.postPracticeReflection ?? null,
    goalForNextTime: s.goalForNextTime ?? null
  }),
  fromFirestore: (snap) => ({ id: snap.id, ...snap.data() } as Session),
};

export interface Song {
  id?: string;
  title: string;
  artist: string;
  genre?: string;
  appleMusicLink?: string;
  spotifyLink?: string;
  // Light denormalization for listing
  sortTitle?: string;   // precomputed lowercase title for case-insensitive sort (optional)
  sortArtist?: string;  // precomputed lowercase artist
}

export const songConverter: FirestoreDataConverter<Song> = {
  toFirestore: (s) => ({
    title: s.title,
    artist: s.artist,
    genre: s.genre ?? null,
    appleMusicLink: s.appleMusicLink ?? null,
    spotifyLink: s.spotifyLink ?? null,
    sortTitle: (s.sortTitle ?? s.title).toLowerCase(),
    sortArtist: (s.sortArtist ?? s.artist).toLowerCase()
  }),
  fromFirestore: (snap) => ({ id: snap.id, ...snap.data() } as Song),
};

// Optional file/document metadata (store actual files in Firebase Storage)
export interface UserDocument {
  id?: string;
  ownerUid: string;
  title: string;
  description?: string;
  storagePath: string;  // e.g., users/{uid}/docs/{docId}.pdf
}

export const userDocumentConverter: FirestoreDataConverter<UserDocument> = {
  toFirestore: (d) => ({
    ownerUid: d.ownerUid,
    title: d.title,
    description: d.description ?? null,
    storagePath: d.storagePath
  }),
  fromFirestore: (snap) => ({ id: snap.id, ...snap.data() } as UserDocument),
};
