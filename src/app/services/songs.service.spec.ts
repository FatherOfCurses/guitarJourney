// songs.service.spec.ts — Firestore mocks before imports (same pattern as session.service.spec.ts)
jest.mock('@angular/fire/firestore', () => ({
  Firestore: class {},
  collection: jest.fn(),
  collectionData: jest.fn(),
  doc: jest.fn(),
  docData: jest.fn(),
  query: jest.fn(),
  orderBy: jest.fn(),
  limit: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  addDoc: jest.fn(),
}));

import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of, firstValueFrom } from 'rxjs';

import * as afs from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';

import { SongsService } from './songs.service';
import { Song } from '../models/song';

describe('SongsService (Firestore)', () => {
  let service: SongsService;
  const mockAuth: Partial<Auth> = {
    currentUser: { uid: 'u1' } as any,
  };

  beforeEach(() => {
    (mockAuth as any).currentUser = { uid: 'u1' } as any;

    TestBed.configureTestingModule({
      providers: [
        SongsService,
        { provide: (afs as any).Firestore, useValue: {} },
        { provide: Auth, useValue: mockAuth },
      ],
    });

    service = TestBed.inject(SongsService);

    jest.clearAllMocks();

    // Default collection()/doc() stubs so .withConverter() chaining works
    (afs.collection as jest.Mock).mockImplementation(() => ({
      withConverter: () => ({ __type: 'CollectionRefWithConverter' }),
    }));

    (afs.doc as jest.Mock).mockImplementation(() => ({
      withConverter: () => ({ __type: 'DocRefWithConverter' }),
    }));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  function makeSong(overrides: Partial<Song> = {}): Song {
    return {
      id: 'song-1',
      ownerUid: 'u1',
      title: 'Blackbird',
      artist: 'The Beatles',
      genre: 'Folk',
      ...overrides,
    };
  }

  // ---------- list$ ----------

  it('list$ returns the current user\'s songs', async () => {
    const collectionDataMock = afs.collectionData as jest.Mock;
    const queryMock = afs.query as jest.Mock;
    const orderByMock = afs.orderBy as jest.Mock;
    const limitMock = afs.limit as jest.Mock;

    const fakeQuery = { __type: 'Query' };
    queryMock.mockReturnValue(fakeQuery);
    orderByMock.mockReturnValue({});
    limitMock.mockReturnValue({});

    const expected = [makeSong({ id: 'A' }), makeSong({ id: 'B' })];
    collectionDataMock.mockReturnValue(of(expected));

    const out = await firstValueFrom(service.list$());

    expect(out).toEqual(expected);
    expect(collectionDataMock).toHaveBeenCalledWith(fakeQuery, { idField: 'id' });
  });

  it('list$ uses default pageSize of 100', async () => {
    const collectionDataMock = afs.collectionData as jest.Mock;
    const queryMock = afs.query as jest.Mock;
    const orderByMock = afs.orderBy as jest.Mock;
    const limitMock = afs.limit as jest.Mock;

    queryMock.mockReturnValue({});
    orderByMock.mockReturnValue({});
    limitMock.mockReturnValue({});
    collectionDataMock.mockReturnValue(of([]));

    await firstValueFrom(service.list$());

    expect(limitMock).toHaveBeenCalledWith(100);
  });

  it('list$ respects a custom pageSize', async () => {
    const collectionDataMock = afs.collectionData as jest.Mock;
    const queryMock = afs.query as jest.Mock;
    const orderByMock = afs.orderBy as jest.Mock;
    const limitMock = afs.limit as jest.Mock;

    queryMock.mockReturnValue({});
    orderByMock.mockReturnValue({});
    limitMock.mockReturnValue({});
    collectionDataMock.mockReturnValue(of([]));

    await firstValueFrom(service.list$(10));

    expect(limitMock).toHaveBeenCalledWith(10);
  });

  it('list$ orders by sortTitle', async () => {
    const collectionDataMock = afs.collectionData as jest.Mock;
    const queryMock = afs.query as jest.Mock;
    const orderByMock = afs.orderBy as jest.Mock;
    const limitMock = afs.limit as jest.Mock;

    queryMock.mockReturnValue({});
    orderByMock.mockReturnValue({});
    limitMock.mockReturnValue({});
    collectionDataMock.mockReturnValue(of([]));

    await firstValueFrom(service.list$());

    expect(orderByMock).toHaveBeenCalledWith('sortTitle');
  });

  it('list$ builds the collection path with the user uid', async () => {
    const collectionMock = afs.collection as jest.Mock;
    const collectionDataMock = afs.collectionData as jest.Mock;
    const queryMock = afs.query as jest.Mock;
    const orderByMock = afs.orderBy as jest.Mock;
    const limitMock = afs.limit as jest.Mock;

    queryMock.mockReturnValue({});
    orderByMock.mockReturnValue({});
    limitMock.mockReturnValue({});
    collectionDataMock.mockReturnValue(of([]));

    await firstValueFrom(service.list$());

    expect(collectionMock).toHaveBeenCalledWith(expect.anything(), 'users/u1/songs');
  });

  // ---------- get$ ----------

  it('get$ streams a single song by id', async () => {
    const docDataMock = afs.docData as jest.Mock;
    const expected = makeSong({ id: 'song-42' });
    docDataMock.mockReturnValue(of(expected));

    const out = await firstValueFrom(service.get$('song-42'));

    expect(out).toEqual(expected);
    expect(docDataMock).toHaveBeenCalled();
  });

  it('get$ builds the correct document path', async () => {
    const docMock = afs.doc as jest.Mock;
    const docDataMock = afs.docData as jest.Mock;
    docDataMock.mockReturnValue(of(makeSong()));

    await firstValueFrom(service.get$('song-99'));

    expect(docMock).toHaveBeenCalledWith(expect.anything(), 'users/u1/songs/song-99');
  });

  // ---------- create ----------

  it('create calls addDoc and returns the new id', async () => {
    const addDocMock = afs.addDoc as jest.Mock;
    addDocMock.mockResolvedValue({ id: 'new-song-1' });

    const id = await service.create({
      title: 'Creep',
      artist: 'Radiohead',
    });

    expect(id).toBe('new-song-1');
    expect(addDocMock).toHaveBeenCalled();
  });

  it('create stamps ownerUid on the payload', async () => {
    const addDocMock = afs.addDoc as jest.Mock;
    addDocMock.mockResolvedValue({ id: 'new-1' });

    await service.create({ title: 'Song', artist: 'Artist' });

    const payload = addDocMock.mock.calls[0][1];
    expect(payload.ownerUid).toBe('u1');
  });

  it('create passes all fields through to the payload', async () => {
    const addDocMock = afs.addDoc as jest.Mock;
    addDocMock.mockResolvedValue({ id: 'new-2' });

    await service.create({
      title: 'Hotel California',
      artist: 'Eagles',
      album: 'Hotel California',
      genre: 'Rock',
      audioLink: 'https://example.com/audio.mp3',
      videoLink: 'https://example.com/video.mp4',
      notationLinks: ['https://example.com/tab.pdf'],
      appleMusicLink: 'https://music.apple.com/track/1',
      spotifyLink: 'https://open.spotify.com/track/2',
    });

    const payload = addDocMock.mock.calls[0][1];
    expect(payload).toEqual({
      ownerUid: 'u1',
      title: 'Hotel California',
      artist: 'Eagles',
      album: 'Hotel California',
      genre: 'Rock',
      audioLink: 'https://example.com/audio.mp3',
      videoLink: 'https://example.com/video.mp4',
      notationLinks: ['https://example.com/tab.pdf'],
      appleMusicLink: 'https://music.apple.com/track/1',
      spotifyLink: 'https://open.spotify.com/track/2',
    });
  });

  it('create builds the collection path with the user uid', async () => {
    const addDocMock = afs.addDoc as jest.Mock;
    const collectionMock = afs.collection as jest.Mock;
    addDocMock.mockResolvedValue({ id: 'new-3' });

    await service.create({ title: 'X', artist: 'Y' });

    expect(collectionMock).toHaveBeenCalledWith(expect.anything(), 'users/u1/songs');
  });

  // ---------- update ----------

  it('update patches fields on a song', fakeAsync(() => {
    const updateDocMock = afs.updateDoc as jest.Mock;
    const docMock = afs.doc as jest.Mock;

    const docRef = { __type: 'DocRef' };
    docMock.mockReturnValue({ withConverter: jest.fn().mockReturnValue(docRef) });
    updateDocMock.mockResolvedValue(undefined);

    let done = false;
    service.update('song-1', { genre: 'Jazz' }).subscribe({ complete: () => (done = true) });
    tick();

    expect(updateDocMock).toHaveBeenCalledWith(docRef, { genre: 'Jazz' });
    expect(done).toBe(true);
  }));

  it('update builds the correct document path', fakeAsync(() => {
    const updateDocMock = afs.updateDoc as jest.Mock;
    const docMock = afs.doc as jest.Mock;

    docMock.mockReturnValue({ withConverter: jest.fn().mockReturnValue({}) });
    updateDocMock.mockResolvedValue(undefined);

    service.update('song-55', { title: 'New Title' }).subscribe();
    tick();

    expect(docMock).toHaveBeenCalledWith(expect.anything(), 'users/u1/songs/song-55');
  }));

  // ---------- delete ----------

  it('delete removes a song', fakeAsync(() => {
    const deleteDocMock = afs.deleteDoc as jest.Mock;
    const docMock = afs.doc as jest.Mock;

    const docRef = { __type: 'DocRef' };
    docMock.mockReturnValue(docRef);
    deleteDocMock.mockResolvedValue(undefined);

    let done = false;
    service.delete('song-1').subscribe({ complete: () => (done = true) });
    tick();

    expect(deleteDocMock).toHaveBeenCalledWith(docRef);
    expect(done).toBe(true);
  }));

  it('delete builds the correct document path', fakeAsync(() => {
    const deleteDocMock = afs.deleteDoc as jest.Mock;
    const docMock = afs.doc as jest.Mock;

    docMock.mockReturnValue({});
    deleteDocMock.mockResolvedValue(undefined);

    service.delete('song-77').subscribe();
    tick();

    expect(docMock).toHaveBeenCalledWith(expect.anything(), 'users/u1/songs/song-77');
  }));

  // ---------- Auth guard ----------

  it('list$ throws when not authenticated', () => {
    (mockAuth as any).currentUser = null;
    expect(() => service.list$()).toThrow('No authenticated user');
  });

  it('get$ throws when not authenticated', () => {
    (mockAuth as any).currentUser = null;
    expect(() => service.get$('abc')).toThrow('No authenticated user');
  });

  it('create throws when not authenticated', () => {
    (mockAuth as any).currentUser = null;
    expect(() => service.create({ title: 'X', artist: 'Y' })).toThrow('No authenticated user');
  });

  it('update throws when not authenticated', () => {
    (mockAuth as any).currentUser = null;
    expect(() => service.update('abc', {})).toThrow('No authenticated user');
  });

  it('delete throws when not authenticated', () => {
    (mockAuth as any).currentUser = null;
    expect(() => service.delete('abc')).toThrow('No authenticated user');
  });
});
