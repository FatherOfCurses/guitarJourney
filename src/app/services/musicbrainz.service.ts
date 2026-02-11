import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  MbArtistSearchResponse,
  MbArtistLookup,
  MbRecordingSearchResponse,
  MbRecordingLookup,
  MbReleaseSearchResponse,
  MbReleaseLookup,
  MbGenreListResponse,
  MbGenre,
} from '@models/musicbrainz';

const API_BASE = 'https://musicbrainz.org/ws/2';
const USER_AGENT = 'GuitarJourney/0.5.0 (https://github.com/FatherOfCurses/guitarJourney)';
const DEFAULT_LIMIT = 25;

@Injectable({ providedIn: 'root' })
export class MusicbrainzService {
  constructor(private http: HttpClient) {}

  // ───── Artist ─────

  /** Full-text search for artists. Uses Lucene query syntax. */
  searchArtists(query: string, limit = DEFAULT_LIMIT, offset = 0): Observable<MbArtistSearchResponse> {
    return this.search<MbArtistSearchResponse>('artist', query, limit, offset);
  }

  /** Lookup a single artist by MBID. Optionally include sub-resources. */
  lookupArtist(mbid: string, inc: string[] = []): Observable<MbArtistLookup> {
    return this.lookup<MbArtistLookup>('artist', mbid, inc);
  }

  // ───── Recording ─────

  /** Full-text search for recordings. */
  searchRecordings(query: string, limit = DEFAULT_LIMIT, offset = 0): Observable<MbRecordingSearchResponse> {
    return this.search<MbRecordingSearchResponse>('recording', query, limit, offset);
  }

  /** Lookup a single recording by MBID. */
  lookupRecording(mbid: string, inc: string[] = []): Observable<MbRecordingLookup> {
    return this.lookup<MbRecordingLookup>('recording', mbid, inc);
  }

  // ───── Release ─────

  /** Full-text search for releases. */
  searchReleases(query: string, limit = DEFAULT_LIMIT, offset = 0): Observable<MbReleaseSearchResponse> {
    return this.search<MbReleaseSearchResponse>('release', query, limit, offset);
  }

  /** Lookup a single release by MBID. */
  lookupRelease(mbid: string, inc: string[] = []): Observable<MbReleaseLookup> {
    return this.lookup<MbReleaseLookup>('release', mbid, inc);
  }

  // ───── Genre ─────

  /** List all MusicBrainz genres (paginated). */
  listGenres(limit = 100, offset = 0): Observable<MbGenreListResponse> {
    const params = new HttpParams()
      .set('fmt', 'json')
      .set('limit', limit)
      .set('offset', offset);

    return this.http.get<MbGenreListResponse>(`${API_BASE}/genre/all`, {
      params,
      headers: { 'User-Agent': USER_AGENT },
    });
  }

  /** Lookup a single genre by MBID. */
  lookupGenre(mbid: string): Observable<MbGenre> {
    const params = new HttpParams().set('fmt', 'json');
    return this.http.get<MbGenre>(`${API_BASE}/genre/${encodeURIComponent(mbid)}`, {
      params,
      headers: { 'User-Agent': USER_AGENT },
    });
  }

  // ───── Internals ─────

  private search<T>(entity: string, query: string, limit: number, offset: number): Observable<T> {
    const params = new HttpParams()
      .set('query', query)
      .set('fmt', 'json')
      .set('limit', limit)
      .set('offset', offset);

    return this.http.get<T>(`${API_BASE}/${entity}`, {
      params,
      headers: { 'User-Agent': USER_AGENT },
    });
  }

  private lookup<T>(entity: string, mbid: string, inc: string[]): Observable<T> {
    let params = new HttpParams().set('fmt', 'json');
    if (inc.length) {
      params = params.set('inc', inc.join('+'));
    }

    return this.http.get<T>(`${API_BASE}/${entity}/${encodeURIComponent(mbid)}`, {
      params,
      headers: { 'User-Agent': USER_AGENT },
    });
  }
}
