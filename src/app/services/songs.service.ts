import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  docData,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
} from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { addDoc } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { Song } from '../models/song';
import { songConverter } from '../storage/converters';

@Injectable({ providedIn: 'root' })
export class SongsService {
  constructor(private fs: Firestore, private auth: Auth) {}

  private uid(): string {
    const uid = this.auth.currentUser?.uid;
    if (!uid) throw new Error('No authenticated user');
    return uid;
  }

  private songsCol(uid = this.uid()) {
    return collection(this.fs, `users/${uid}/songs`).withConverter(songConverter);
  }

  /** Live list of the current user's songs, ordered by title. */
  list$(pageSize = 100): Observable<Song[]> {
    const col = this.songsCol();
    const q = query(col, orderBy('sortTitle'), limit(pageSize));
    return collectionData(q, { idField: 'id' }) as unknown as Observable<Song[]>;
  }

  /** Stream a single song by id. */
  get$(id: string): Observable<Song | undefined> {
    const uid = this.uid();
    const ref = doc(this.fs, `users/${uid}/songs/${id}`).withConverter(songConverter);
    return docData(ref, { idField: 'id' }) as unknown as Observable<Song | undefined>;
  }

  /** Create a new song for the current user. */
  create(input: Omit<Song, 'id' | 'ownerUid' | 'sortTitle' | 'sortArtist'>): Promise<string> {
    const uid = this.uid();
    const col = collection(this.fs, `users/${uid}/songs`).withConverter(songConverter);
    const payload: Song = {
      ownerUid: uid,
      title: input.title,
      artist: input.artist,
      album: input.album,
      genre: input.genre,
      audioLink: input.audioLink,
      videoLink: input.videoLink,
      notationLinks: input.notationLinks,
      appleMusicLink: input.appleMusicLink,
      spotifyLink: input.spotifyLink,
    };
    return addDoc(col, payload).then((res) => res.id);
  }

  /** Patch fields on an existing song. */
  update(id: string, patch: Partial<Song>) {
    const uid = this.uid();
    const ref = doc(this.fs, `users/${uid}/songs/${id}`).withConverter(songConverter);
    return from(updateDoc(ref, patch as any));
  }

  /** Delete a song. */
  delete(id: string) {
    const uid = this.uid();
    const ref = doc(this.fs, `users/${uid}/songs/${id}`);
    return from(deleteDoc(ref));
  }
}
