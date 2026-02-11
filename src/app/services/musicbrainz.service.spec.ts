import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { MusicbrainzService } from './musicbrainz.service';
import type {
  MbArtistSearchResponse,
  MbArtistLookup,
  MbRecordingSearchResponse,
  MbRecordingLookup,
  MbReleaseSearchResponse,
  MbReleaseLookup,
  MbGenreListResponse,
  MbGenre,
} from '@models/musicbrainz';

const API = 'https://musicbrainz.org/ws/2';

describe('MusicbrainzService', () => {
  let service: MusicbrainzService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(MusicbrainzService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  // ───── searchArtists ─────

  it('sends a GET to /artist with query, fmt, limit, offset', () => {
    const stub: MbArtistSearchResponse = { created: '', count: 1, offset: 0, artists: [] };
    service.searchArtists('beatles').subscribe(res => {
      expect(res).toEqual(stub);
    });

    const req = httpTesting.expectOne(r =>
      r.url === `${API}/artist` && r.params.get('query') === 'beatles'
    );
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('fmt')).toBe('json');
    expect(req.request.params.get('limit')).toBe('25');
    expect(req.request.params.get('offset')).toBe('0');
    req.flush(stub);
  });

  it('searchArtists respects custom limit and offset', () => {
    service.searchArtists('pink floyd', 10, 50).subscribe();
    const req = httpTesting.expectOne(r => r.url === `${API}/artist`);
    expect(req.request.params.get('limit')).toBe('10');
    expect(req.request.params.get('offset')).toBe('50');
    req.flush({ created: '', count: 0, offset: 50, artists: [] });
  });

  it('searchArtists includes User-Agent header', () => {
    service.searchArtists('queen').subscribe();
    const req = httpTesting.expectOne(r => r.url === `${API}/artist`);
    expect(req.request.headers.get('User-Agent')).toContain('GuitarJourney');
    req.flush({ created: '', count: 0, offset: 0, artists: [] });
  });

  // ───── lookupArtist ─────

  it('sends a GET to /artist/<mbid> with fmt=json', () => {
    const mbid = 'b10bbbfc-cf9e-42e0-be17-e2c3e1d2600d';
    const stub: MbArtistLookup = { id: mbid, name: 'The Beatles', 'sort-name': 'Beatles, The', type: 'Group' };
    service.lookupArtist(mbid).subscribe(res => {
      expect(res).toEqual(stub);
    });

    const req = httpTesting.expectOne(r => r.url === `${API}/artist/${mbid}`);
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('fmt')).toBe('json');
    expect(req.request.params.has('inc')).toBe(false);
    req.flush(stub);
  });

  it('lookupArtist appends inc when provided', () => {
    const mbid = 'abc-123';
    service.lookupArtist(mbid, ['recordings', 'releases']).subscribe();
    const req = httpTesting.expectOne(r => r.url === `${API}/artist/${mbid}`);
    expect(req.request.params.get('inc')).toBe('recordings+releases');
    req.flush({ id: mbid, name: 'X', 'sort-name': 'X', type: null });
  });

  // ───── searchRecordings ─────

  it('sends a GET to /recording with query params', () => {
    const stub: MbRecordingSearchResponse = { created: '', count: 5, offset: 0, recordings: [] };
    service.searchRecordings('yesterday').subscribe(res => {
      expect(res).toEqual(stub);
    });

    const req = httpTesting.expectOne(r =>
      r.url === `${API}/recording` && r.params.get('query') === 'yesterday'
    );
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('fmt')).toBe('json');
    req.flush(stub);
  });

  it('searchRecordings respects custom limit and offset', () => {
    service.searchRecordings('stairway', 5, 20).subscribe();
    const req = httpTesting.expectOne(r => r.url === `${API}/recording`);
    expect(req.request.params.get('limit')).toBe('5');
    expect(req.request.params.get('offset')).toBe('20');
    req.flush({ created: '', count: 0, offset: 20, recordings: [] });
  });

  // ───── lookupRecording ─────

  it('sends a GET to /recording/<mbid>', () => {
    const mbid = 'rec-001';
    const stub: MbRecordingLookup = { id: mbid, title: 'Yesterday', length: 125000 };
    service.lookupRecording(mbid).subscribe(res => {
      expect(res).toEqual(stub);
    });

    const req = httpTesting.expectOne(r => r.url === `${API}/recording/${mbid}`);
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('fmt')).toBe('json');
    req.flush(stub);
  });

  it('lookupRecording appends inc when provided', () => {
    const mbid = 'rec-002';
    service.lookupRecording(mbid, ['releases']).subscribe();
    const req = httpTesting.expectOne(r => r.url === `${API}/recording/${mbid}`);
    expect(req.request.params.get('inc')).toBe('releases');
    req.flush({ id: mbid, title: 'X' });
  });

  // ───── searchReleases ─────

  it('sends a GET to /release with query params', () => {
    const stub: MbReleaseSearchResponse = { created: '', count: 3, offset: 0, releases: [] };
    service.searchReleases('abbey road').subscribe(res => {
      expect(res).toEqual(stub);
    });

    const req = httpTesting.expectOne(r =>
      r.url === `${API}/release` && r.params.get('query') === 'abbey road'
    );
    expect(req.request.method).toBe('GET');
    req.flush(stub);
  });

  it('searchReleases respects custom limit and offset', () => {
    service.searchReleases('thriller', 15, 30).subscribe();
    const req = httpTesting.expectOne(r => r.url === `${API}/release`);
    expect(req.request.params.get('limit')).toBe('15');
    expect(req.request.params.get('offset')).toBe('30');
    req.flush({ created: '', count: 0, offset: 30, releases: [] });
  });

  // ───── lookupRelease ─────

  it('sends a GET to /release/<mbid>', () => {
    const mbid = 'rel-001';
    const stub: MbReleaseLookup = { id: mbid, title: 'Abbey Road', status: 'Official' };
    service.lookupRelease(mbid).subscribe(res => {
      expect(res).toEqual(stub);
    });

    const req = httpTesting.expectOne(r => r.url === `${API}/release/${mbid}`);
    expect(req.request.method).toBe('GET');
    req.flush(stub);
  });

  it('lookupRelease appends inc when provided', () => {
    const mbid = 'rel-002';
    service.lookupRelease(mbid, ['recordings', 'labels']).subscribe();
    const req = httpTesting.expectOne(r => r.url === `${API}/release/${mbid}`);
    expect(req.request.params.get('inc')).toBe('recordings+labels');
    req.flush({ id: mbid, title: 'X' });
  });

  // ───── listGenres ─────

  it('sends a GET to /genre/all with default limit=100', () => {
    const stub: MbGenreListResponse = { 'genre-offset': 0, 'genre-count': 2119, genres: [] };
    service.listGenres().subscribe(res => {
      expect(res).toEqual(stub);
    });

    const req = httpTesting.expectOne(r => r.url === `${API}/genre/all`);
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('fmt')).toBe('json');
    expect(req.request.params.get('limit')).toBe('100');
    expect(req.request.params.get('offset')).toBe('0');
    req.flush(stub);
  });

  it('listGenres respects custom limit and offset', () => {
    service.listGenres(50, 200).subscribe();
    const req = httpTesting.expectOne(r => r.url === `${API}/genre/all`);
    expect(req.request.params.get('limit')).toBe('50');
    expect(req.request.params.get('offset')).toBe('200');
    req.flush({ 'genre-offset': 200, 'genre-count': 2119, genres: [] });
  });

  it('listGenres includes User-Agent header', () => {
    service.listGenres().subscribe();
    const req = httpTesting.expectOne(r => r.url === `${API}/genre/all`);
    expect(req.request.headers.get('User-Agent')).toContain('GuitarJourney');
    req.flush({ 'genre-offset': 0, 'genre-count': 0, genres: [] });
  });

  // ───── lookupGenre ─────

  it('sends a GET to /genre/<mbid>', () => {
    const mbid = 'genre-001';
    const stub: MbGenre = { id: mbid, name: 'Rock' };
    service.lookupGenre(mbid).subscribe(res => {
      expect(res).toEqual(stub);
    });

    const req = httpTesting.expectOne(r => r.url === `${API}/genre/${mbid}`);
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('fmt')).toBe('json');
    req.flush(stub);
  });

  // ───── Error handling ─────

  it('propagates HTTP errors to the subscriber', () => {
    service.searchArtists('nonexistent').subscribe({
      error: err => {
        expect(err.status).toBe(503);
      },
    });

    const req = httpTesting.expectOne(r => r.url === `${API}/artist`);
    req.flush('Service Unavailable', { status: 503, statusText: 'Service Unavailable' });
  });
});
