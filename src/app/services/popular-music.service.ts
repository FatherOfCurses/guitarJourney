import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from '@angular/fire/firestore';
import { from, Observable, map } from 'rxjs';
import { popularArtistConverter, popularAlbumConverter, popularSongConverter } from '../storage/popular-music.converters';

@Injectable({ providedIn: 'root' })
export class PopularMusicService {
  private firestore = inject(Firestore);

  searchArtists(prefix: string, maxResults = 10): Observable<string[]> {
    const lower = prefix.toLowerCase();
    const col = collection(this.firestore, 'popularArtists').withConverter(popularArtistConverter);
    const q = query(
      col,
      where('sortName', '>=', lower),
      where('sortName', '<', lower + '\uf8ff'),
      orderBy('sortName'),
      limit(maxResults),
    );
    return from(getDocs(q)).pipe(
      map(snap => snap.docs.map(d => d.data().name as string)),
    );
  }

  searchAlbums(prefix: string, maxResults = 10): Observable<string[]> {
    const lower = prefix.toLowerCase();
    const col = collection(this.firestore, 'popularAlbums').withConverter(popularAlbumConverter);
    const q = query(
      col,
      where('sortTitle', '>=', lower),
      where('sortTitle', '<', lower + '\uf8ff'),
      orderBy('sortTitle'),
      limit(maxResults),
    );
    return from(getDocs(q)).pipe(
      map(snap => snap.docs.map(d => d.data().title as string)),
    );
  }

  searchSongs(prefix: string, maxResults = 10): Observable<string[]> {
    const lower = prefix.toLowerCase();
    const col = collection(this.firestore, 'popularSongs').withConverter(popularSongConverter);
    const q = query(
      col,
      where('sortTitle', '>=', lower),
      where('sortTitle', '<', lower + '\uf8ff'),
      orderBy('sortTitle'),
      limit(maxResults),
    );
    return from(getDocs(q)).pipe(
      map(snap => snap.docs.map(d => d.data().title as string)),
    );
  }
}
