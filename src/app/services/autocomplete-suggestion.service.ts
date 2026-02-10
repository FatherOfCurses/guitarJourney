import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { PopularMusicService } from './popular-music.service';
import { MusicbrainzService } from './musicbrainz.service';

const LOCAL_THRESHOLD = 3;
const MB_LIMIT = 5;

@Injectable({ providedIn: 'root' })
export class AutocompleteSuggestionService {
  private popular = inject(PopularMusicService);
  private mb = inject(MusicbrainzService);

  suggestArtists(query: string): Observable<string[]> {
    return this.popular.searchArtists(query).pipe(
      switchMap(localResults => {
        if (localResults.length >= LOCAL_THRESHOLD) {
          return of(localResults);
        }
        return this.mb.searchArtists(query, MB_LIMIT).pipe(
          map(res => res.artists.map(a => a.name)),
          catchError(() => of([])),
          map(mbResults => this.dedup([...localResults, ...mbResults])),
        );
      }),
    );
  }

  suggestTitles(query: string): Observable<string[]> {
    return this.popular.searchSongs(query).pipe(
      switchMap(localResults => {
        if (localResults.length >= LOCAL_THRESHOLD) {
          return of(localResults);
        }
        return this.mb.searchRecordings(query, MB_LIMIT).pipe(
          map(res => res.recordings.map(r => r.title)),
          catchError(() => of([])),
          map(mbResults => this.dedup([...localResults, ...mbResults])),
        );
      }),
    );
  }

  suggestAlbums(query: string): Observable<string[]> {
    return this.popular.searchAlbums(query).pipe(
      switchMap(localResults => {
        if (localResults.length >= LOCAL_THRESHOLD) {
          return of(localResults);
        }
        return this.mb.searchReleases(query, MB_LIMIT).pipe(
          map(res => res.releases.map(r => r.title)),
          catchError(() => of([])),
          map(mbResults => this.dedup([...localResults, ...mbResults])),
        );
      }),
    );
  }

  private dedup(items: string[]): string[] {
    const seen = new Set<string>();
    return items.filter(item => {
      const key = item.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }
}
