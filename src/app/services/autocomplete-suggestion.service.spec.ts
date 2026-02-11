import { TestBed } from '@angular/core/testing';
import { of, throwError, firstValueFrom } from 'rxjs';
import { AutocompleteSuggestionService } from './autocomplete-suggestion.service';
import { PopularMusicService } from './popular-music.service';
import { MusicbrainzService } from './musicbrainz.service';

describe('AutocompleteSuggestionService', () => {
  let service: AutocompleteSuggestionService;

  const popularMock: any = {
    searchArtists: jest.fn(() => of([])),
    searchAlbums: jest.fn(() => of([])),
    searchSongs: jest.fn(() => of([])),
  };

  const mbMock: any = {
    searchArtists: jest.fn(() => of({ artists: [] })),
    searchRecordings: jest.fn(() => of({ recordings: [] })),
    searchReleases: jest.fn(() => of({ releases: [] })),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    TestBed.configureTestingModule({
      providers: [
        AutocompleteSuggestionService,
        { provide: PopularMusicService, useValue: popularMock },
        { provide: MusicbrainzService, useValue: mbMock },
      ],
    });
    service = TestBed.inject(AutocompleteSuggestionService);
  });

  // ───── suggestArtists ─────

  it('returns local results only when >= 3 matches (no MusicBrainz call)', async () => {
    popularMock.searchArtists.mockReturnValue(of(['The Beatles', 'The Rolling Stones', 'The Who']));

    const results = await firstValueFrom(service.suggestArtists('the'));

    expect(results).toEqual(['The Beatles', 'The Rolling Stones', 'The Who']);
    expect(mbMock.searchArtists).not.toHaveBeenCalled();
  });

  it('falls back to MusicBrainz when local results < 3', async () => {
    popularMock.searchArtists.mockReturnValue(of(['Radiohead']));
    mbMock.searchArtists.mockReturnValue(of({
      artists: [{ name: 'Radiohead' }, { name: 'Radio Moscow' }],
    }));

    const results = await firstValueFrom(service.suggestArtists('radio'));

    expect(mbMock.searchArtists).toHaveBeenCalledWith('radio', 5);
    expect(results).toContain('Radiohead');
    expect(results).toContain('Radio Moscow');
  });

  it('deduplicates results case-insensitively', async () => {
    popularMock.searchArtists.mockReturnValue(of(['The Beatles']));
    mbMock.searchArtists.mockReturnValue(of({
      artists: [{ name: 'the beatles' }, { name: 'Beatles Revival' }],
    }));

    const results = await firstValueFrom(service.suggestArtists('beatl'));

    // "The Beatles" from local and "the beatles" from MB should collapse to one
    const beatlesCount = results.filter(r => r.toLowerCase() === 'the beatles').length;
    expect(beatlesCount).toBe(1);
    expect(results).toContain('Beatles Revival');
  });

  it('handles MusicBrainz error gracefully (returns local only)', async () => {
    popularMock.searchArtists.mockReturnValue(of(['Pink Floyd']));
    mbMock.searchArtists.mockReturnValue(throwError(() => new Error('503')));

    const results = await firstValueFrom(service.suggestArtists('pink'));

    expect(results).toEqual(['Pink Floyd']);
  });

  // ───── suggestTitles ─────

  it('returns local song results when >= 3 matches', async () => {
    popularMock.searchSongs.mockReturnValue(of(['Blackbird', 'Black Dog', 'Back in Black']));

    const results = await firstValueFrom(service.suggestTitles('bla'));

    expect(results).toEqual(['Blackbird', 'Black Dog', 'Back in Black']);
    expect(mbMock.searchRecordings).not.toHaveBeenCalled();
  });

  it('falls back to MusicBrainz recordings when local < 3', async () => {
    popularMock.searchSongs.mockReturnValue(of(['Yesterday']));
    mbMock.searchRecordings.mockReturnValue(of({
      recordings: [{ title: 'Yesterday' }, { title: 'Yesterday Once More' }],
    }));

    const results = await firstValueFrom(service.suggestTitles('yester'));

    expect(mbMock.searchRecordings).toHaveBeenCalledWith('yester', 5);
    expect(results).toContain('Yesterday');
    expect(results).toContain('Yesterday Once More');
  });

  it('handles MusicBrainz recording error gracefully', async () => {
    popularMock.searchSongs.mockReturnValue(of(['Creep']));
    mbMock.searchRecordings.mockReturnValue(throwError(() => new Error('timeout')));

    const results = await firstValueFrom(service.suggestTitles('cre'));

    expect(results).toEqual(['Creep']);
  });

  // ───── suggestAlbums ─────

  it('returns local album results when >= 3 matches', async () => {
    popularMock.searchAlbums.mockReturnValue(of(['Abbey Road', 'A Night at the Opera', 'Ah Via Musicom']));

    const results = await firstValueFrom(service.suggestAlbums('a'));

    expect(results).toEqual(['Abbey Road', 'A Night at the Opera', 'Ah Via Musicom']);
    expect(mbMock.searchReleases).not.toHaveBeenCalled();
  });

  it('falls back to MusicBrainz releases when local < 3', async () => {
    popularMock.searchAlbums.mockReturnValue(of(['Rumours']));
    mbMock.searchReleases.mockReturnValue(of({
      releases: [{ title: 'Rumours' }, { title: 'Rumours (Deluxe)' }],
    }));

    const results = await firstValueFrom(service.suggestAlbums('rum'));

    expect(mbMock.searchReleases).toHaveBeenCalledWith('rum', 5);
    expect(results).toContain('Rumours');
    expect(results).toContain('Rumours (Deluxe)');
  });

  it('handles MusicBrainz release error gracefully', async () => {
    popularMock.searchAlbums.mockReturnValue(of([]));
    mbMock.searchReleases.mockReturnValue(throwError(() => new Error('network')));

    const results = await firstValueFrom(service.suggestAlbums('zzz'));

    expect(results).toEqual([]);
  });

  // ───── Edge cases ─────

  it('returns empty when both sources return nothing', async () => {
    popularMock.searchArtists.mockReturnValue(of([]));
    mbMock.searchArtists.mockReturnValue(of({ artists: [] }));

    const results = await firstValueFrom(service.suggestArtists('xyznonexistent'));

    expect(results).toEqual([]);
  });
});
