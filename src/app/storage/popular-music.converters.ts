import { FirestoreDataConverter } from 'firebase/firestore';
import { PopularArtist, PopularAlbum, PopularSong } from '../models/popular-music';

export const popularArtistConverter: FirestoreDataConverter<PopularArtist> = {
  toFirestore: (a) => ({
    name: a.name,
    sortName: (a.sortName ?? a.name).toLowerCase(),
  }),
  fromFirestore: (snap) => ({ id: snap.id, ...snap.data() } as PopularArtist),
};

export const popularAlbumConverter: FirestoreDataConverter<PopularAlbum> = {
  toFirestore: (a) => ({
    title: a.title,
    artist: a.artist,
    sortTitle: (a.sortTitle ?? a.title).toLowerCase(),
  }),
  fromFirestore: (snap) => ({ id: snap.id, ...snap.data() } as PopularAlbum),
};

export const popularSongConverter: FirestoreDataConverter<PopularSong> = {
  toFirestore: (s) => ({
    title: s.title,
    artist: s.artist,
    sortTitle: (s.sortTitle ?? s.title).toLowerCase(),
  }),
  fromFirestore: (snap) => ({ id: snap.id, ...snap.data() } as PopularSong),
};
