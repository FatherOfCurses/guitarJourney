// session.service.spec.ts — Firestore version using ESM-safe Jest module mocks
/**
 * IMPORTANT: We mock AngularFire/Firebase modules BEFORE importing the service under test,
 * to avoid "Cannot redefine property: collection" errors.
 */
jest.mock('@angular/fire/firestore', () => ({
  // DI token so TestBed can inject something for Firestore
  Firestore: class {},
  // Query building + data functions we call from the service
  collection: jest.fn(),
  collectionData: jest.fn(),
  doc: jest.fn(),
  docData: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  limit: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
}));

jest.mock('firebase/firestore', () => {
  const actual = jest.requireActual<typeof import('firebase/firestore')>('firebase/firestore');

  // Patch Timestamp.now to return a deterministic value
  (actual.Timestamp as any).now = jest.fn(() =>
    actual.Timestamp.fromDate(new Date('2025-01-02T03:04:05Z'))
  );

  // Light stubs for the pieces you use
  const withConverter = jest.fn().mockReturnValue('mock-collection');
  const collection = jest.fn(() => ({ withConverter }));

  return {
    ...actual, // keep the real module (incl. real Timestamp class)
    getFirestore: jest.fn(() => ({ /* your db stub if needed */ })),
    collection,
    addDoc: jest.fn(async () => ({ id: 'test-id-123' })),
  };
});

import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of, firstValueFrom } from 'rxjs';

import * as afs from '@angular/fire/firestore';
import * as fbfs from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore';
import { Auth } from '@angular/fire/auth';

import { SessionService } from './session.service';
import { Session } from '../models/session';

describe('SessionService (Firestore)', () => {
  let service: SessionService;
  let fromDateSpy: jest.SpiedFunction<typeof fbfs.Timestamp.fromDate>;
  // Stable logged-in user for most tests
  const mockAuth: Partial<Auth> = {
    currentUser: { uid: 'u1' } as any,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SessionService,
        // Provide DI token for Firestore (we never call instance methods directly)
        { provide: (afs as any).Firestore, useValue: {} },
        { provide: Auth, useValue: mockAuth },
      ],
    });

    service = TestBed.inject(SessionService);
    fromDateSpy = jest.spyOn(fbfs.Timestamp, 'fromDate')

    // Clear any call history on mocked module functions between tests
    jest.clearAllMocks();

    jest
    .spyOn(Timestamp, 'now')
    .mockReturnValue(Timestamp.fromDate(new Date('2025-01-02T03:04:05Z')));

    // Provide safe defaults for collection()/doc() so .withConverter() chaining won't explode,
    // since the service may call .withConverter(sessionConverter) on either of them.
    (afs.collection as jest.Mock).mockImplementation(() => ({
      __type: 'CollectionRef',
      withConverter: () => ({
        __type: 'CollectionRefWithConverter',
      }),
    }));
    
    (afs.doc as jest.Mock).mockImplementation(() => ({
      __type: 'DocRef',
      withConverter: () => ({
        __type: 'DocRefWithConverter',
      }),
    }));
  });

  afterEach(() => {
    // Ensure no unexpected mocks are left over between tests
    fromDateSpy.mockRestore();
    jest.restoreAllMocks();
  });

  function makeSession(overrides: Partial<Session> = {}): Session {
    // Minimal viable Session object for tests; adjust if your model differs
    return {
      id: 's1',
      ownerUid: 'u1',
      date: (fbfs.Timestamp as any).fromMillis(1_700_000_000_000) as any,
      practiceTime: 30,
      whatToPractice: 'Scales',
      sessionIntent: 'Technique',
      postPracticeReflection: 'Felt good',
      goalForNextTime: 'Increase tempo',
      ...overrides,
    } as Session;
  }

  it('list$ returns current user sessions (newest-first)', async () => {
    const collectionDataMock = afs.collectionData as jest.Mock;
    const queryMock = afs.query as jest.Mock;
    const whereMock = afs.where as jest.Mock;
    const orderByMock = afs.orderBy as jest.Mock;
    const limitMock = afs.limit as jest.Mock;

    const fakeQueryRef = { __type: 'Query' };
    queryMock.mockReturnValue(fakeQueryRef);
    whereMock.mockReturnValue({}); orderByMock.mockReturnValue({}); limitMock.mockReturnValue({});

    const expected = [makeSession({ id: 'A' }), makeSession({ id: 'B' })];
    collectionDataMock.mockReturnValue(of(expected));

    const out = await firstValueFrom(service.list$(10));
    expect(out).toEqual(expected);
    expect(collectionDataMock).toHaveBeenCalledWith(fakeQueryRef, { idField: 'id' });
  });

  it('applies range (start<=date<=end) and returns sessions', async () => {
    const collectionDataMock = afs.collectionData as jest.Mock;
    const queryMock         = afs.query as jest.Mock;
    const whereMock         = afs.where as jest.Mock;
    const orderByMock       = afs.orderBy as jest.Mock;
    const limitMock         = afs.limit as jest.Mock;

    const fakeQueryRef = { __type: 'Query' };
    queryMock.mockReturnValue(fakeQueryRef);
    whereMock.mockReturnValue({});
    orderByMock.mockReturnValue({});
    limitMock.mockReturnValue({});

    const expected = [makeSession({ id: 'X' })];
    collectionDataMock.mockReturnValue(of(expected));

    const start = new Date('2025-01-01T00:00:00Z');
    const end   = new Date('2025-01-31T23:59:59Z');

    const out = await firstValueFrom(service.listByDate$(start, end, 25));

    expect(out).toEqual(expected);
    expect(collectionDataMock).toHaveBeenCalledWith(fakeQueryRef, { idField: 'id' });

    // ✅ Now these are valid because `fromDate` is a spy
    expect(fromDateSpy).toHaveBeenCalledWith(start);
    expect(fromDateSpy).toHaveBeenCalledWith(end);

    // Optional: also verify the where constraints were built with Timestamps
    expect(whereMock).toHaveBeenCalledWith('date', '>=', expect.any(fbfs.Timestamp));
    expect(whereMock).toHaveBeenCalledWith('date', '<=', expect.any(fbfs.Timestamp));
  });

  it('get$ streams a single session by id', async () => {
    const docDataMock = afs.docData as jest.Mock;
    const fakeDocOut = makeSession({ id: 's42' });
    docDataMock.mockReturnValue(of(fakeDocOut));

    const out = await firstValueFrom(service.get$('s42'));
    expect(out).toEqual(fakeDocOut);
    expect(docDataMock).toHaveBeenCalled();
  });

  it('create uses addDoc() and returns the new id', async () => {
    const getFirestoreMock = fbfs.getFirestore as jest.Mock;
    const collectionMock = afs.collection as jest.Mock;
    const addDocMock = fbfs.addDoc as jest.Mock;

    const fakeDb = { __type: 'Db' };
    const fakeColRef = { __type: 'CollectionRef', withConverter: () => ({}) };
    getFirestoreMock.mockReturnValue(fakeDb);
    collectionMock.mockReturnValue(fakeColRef);
    addDocMock.mockResolvedValue({ id: 'new123' });

    const id = await service.create({ practiceTime: 25 } as any);
    expect(id).toBe('new123');
    expect(collectionMock).toHaveBeenCalledWith(fakeDb, 'users/u1/sessions');
  });

it('update patches fields on a session', fakeAsync(() => {
  const updateDocMock = afs.updateDoc as jest.Mock;
  const docMock       = afs.doc as jest.Mock;

  // Return a usable doc ref from doc(...).withConverter(...)
  const docRef = { __type: 'DocRef' };
  docMock.mockReturnValue({
    withConverter: jest.fn().mockReturnValue(docRef),
  });

  // IMPORTANT: make updateDoc resolve (like the real SDK)
  updateDocMock.mockResolvedValue(undefined); // or Promise.resolve()

  let done = false;
  service.update('abc', { practiceTime: 40 }).subscribe({ complete: () => (done = true) });
  tick();

  expect(updateDocMock).toHaveBeenCalledWith(docRef, { practiceTime: 40 });
  expect(done).toBe(true);
}));

  it('delete removes a session', fakeAsync(() => {
    const deleteDocMock = afs.deleteDoc as jest.Mock;
    const docMock       = afs.doc as jest.Mock;

      // Return a usable doc ref from doc(...).withConverter(...)
    const docRef = { __type: 'DocRef' };
    docMock.mockReturnValue({
      withConverter: jest.fn().mockReturnValue(docRef),
    });

      // IMPORTANT: make updateDoc resolve (like the real SDK)
      deleteDocMock.mockResolvedValue(undefined); // or Promise.resolve()

    let done = false;
    service.delete('abc').subscribe({ complete: () => (done = true) });
    tick();

    expect(deleteDocMock).toHaveBeenCalled();
    expect(done).toBe(true);
  }));

  it('throws if there is no authenticated user', () => {
    const auth = TestBed.inject(Auth) as any;
    auth.currentUser = null;
    expect(() => service.list$()).toThrow();
  });
});
