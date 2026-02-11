jest.mock('@angular/fire/firestore', () => ({
  Firestore: class {},
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  limit: jest.fn(),
  getDocs: jest.fn(),
}));

import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import * as afs from '@angular/fire/firestore';
import { PopularMusicService } from './popular-music.service';

describe('PopularMusicService', () => {
  let service: PopularMusicService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PopularMusicService,
        { provide: (afs as any).Firestore, useValue: {} },
      ],
    });
    service = TestBed.inject(PopularMusicService);
    jest.clearAllMocks();

    (afs.collection as jest.Mock).mockImplementation(() => ({
      withConverter: () => ({ __type: 'CollectionRefWithConverter' }),
    }));
    (afs.query as jest.Mock).mockReturnValue({ __type: 'Query' });
    (afs.where as jest.Mock).mockReturnValue({});
    (afs.orderBy as jest.Mock).mockReturnValue({});
    (afs.limit as jest.Mock).mockReturnValue({});
  });

  afterEach(() => jest.restoreAllMocks());

  // ───── searchArtists ─────

  it('searchArtists queries the popularArtists collection', async () => {
    (afs.getDocs as jest.Mock).mockResolvedValue({
      docs: [{ data: () => ({ name: 'The Beatles', sortName: 'the beatles' }) }],
    });

    const results = await firstValueFrom(service.searchArtists('the'));

    expect(afs.collection).toHaveBeenCalledWith(expect.anything(), 'popularArtists');
    expect(results).toEqual(['The Beatles']);
  });

  it('searchArtists uses prefix range with where clauses', async () => {
    (afs.getDocs as jest.Mock).mockResolvedValue({ docs: [] });

    await firstValueFrom(service.searchArtists('Bea'));

    expect(afs.where).toHaveBeenCalledWith('sortName', '>=', 'bea');
    expect(afs.where).toHaveBeenCalledWith('sortName', '<', 'bea\uf8ff');
    expect(afs.orderBy).toHaveBeenCalledWith('sortName');
  });

  it('searchArtists respects maxResults via limit', async () => {
    (afs.getDocs as jest.Mock).mockResolvedValue({ docs: [] });

    await firstValueFrom(service.searchArtists('z', 5));

    expect(afs.limit).toHaveBeenCalledWith(5);
  });

  it('searchArtists returns empty array when no matches', async () => {
    (afs.getDocs as jest.Mock).mockResolvedValue({ docs: [] });

    const results = await firstValueFrom(service.searchArtists('zzz'));

    expect(results).toEqual([]);
  });

  // ───── searchAlbums ─────

  it('searchAlbums queries the popularAlbums collection', async () => {
    (afs.getDocs as jest.Mock).mockResolvedValue({
      docs: [{ data: () => ({ title: 'Abbey Road', artist: 'The Beatles', sortTitle: 'abbey road' }) }],
    });

    const results = await firstValueFrom(service.searchAlbums('abb'));

    expect(afs.collection).toHaveBeenCalledWith(expect.anything(), 'popularAlbums');
    expect(results).toEqual(['Abbey Road']);
  });

  it('searchAlbums uses sortTitle for prefix range', async () => {
    (afs.getDocs as jest.Mock).mockResolvedValue({ docs: [] });

    await firstValueFrom(service.searchAlbums('Dark'));

    expect(afs.where).toHaveBeenCalledWith('sortTitle', '>=', 'dark');
    expect(afs.where).toHaveBeenCalledWith('sortTitle', '<', 'dark\uf8ff');
  });

  // ───── searchSongs ─────

  it('searchSongs queries the popularSongs collection', async () => {
    (afs.getDocs as jest.Mock).mockResolvedValue({
      docs: [{ data: () => ({ title: 'Stairway to Heaven', artist: 'Led Zeppelin', sortTitle: 'stairway to heaven' }) }],
    });

    const results = await firstValueFrom(service.searchSongs('stair'));

    expect(afs.collection).toHaveBeenCalledWith(expect.anything(), 'popularSongs');
    expect(results).toEqual(['Stairway to Heaven']);
  });

  it('searchSongs uses sortTitle for prefix range', async () => {
    (afs.getDocs as jest.Mock).mockResolvedValue({ docs: [] });

    await firstValueFrom(service.searchSongs('Hotel'));

    expect(afs.where).toHaveBeenCalledWith('sortTitle', '>=', 'hotel');
    expect(afs.where).toHaveBeenCalledWith('sortTitle', '<', 'hotel\uf8ff');
  });
});
