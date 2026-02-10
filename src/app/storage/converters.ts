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
  ownerUid: string;
  title: string;
  artist: string;
  album?: string;
  genre?: string;
  audioLink?: string;
  videoLink?: string;
  notationLinks?: string[];
  appleMusicLink?: string;
  spotifyLink?: string;
  sortTitle?: string;
  sortArtist?: string;
}

export const songConverter: FirestoreDataConverter<Song> = {
  toFirestore: (s) => ({
    ownerUid: s.ownerUid,
    title: s.title,
    artist: s.artist,
    album: s.album ?? null,
    genre: s.genre ?? null,
    audioLink: s.audioLink ?? null,
    videoLink: s.videoLink ?? null,
    notationLinks: s.notationLinks ?? [],
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
