jest.mock('@angular/fire/firestore', () => ({
  Firestore: class {},
  collectionData: jest.fn(),
}));

jest.mock('firebase/firestore', () => {
  const withConverter = jest.fn().mockReturnThis();
  const collection = jest.fn(() => ({ withConverter, _isMock: true }));
  const doc = jest.fn((db: any, path: string) => ({ _path: path }));

  return {
    getFirestore: jest.fn(() => ({})),
    collection,
    doc,
    query: jest.fn((q: any) => q),
    where: jest.fn(),
    orderBy: jest.fn(),
    limit: jest.fn(),
    addDoc: jest.fn(async () => ({ id: 'new-res-id' })),
    getDocs: jest.fn(async () => ({ empty: true, docs: [] })),
    updateDoc: jest.fn(async () => undefined),
    deleteDoc: jest.fn(async () => undefined),
    serverTimestamp: jest.fn(() => 'server-ts'),
    increment: jest.fn((n: number) => ({ _increment: n })),
  };
});

import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Auth } from '@angular/fire/auth';

import * as afs from '@angular/fire/firestore';
import * as fbfs from 'firebase/firestore';

import { ResourceService } from './resource.service';

describe('ResourceService', () => {
  let service: ResourceService;
  const mockAuth: Partial<Auth> = { currentUser: { uid: 'u1' } as any };

  beforeEach(() => {
    (mockAuth as any).currentUser = { uid: 'u1' } as any;

    TestBed.configureTestingModule({
      providers: [
        ResourceService,
        { provide: (afs as any).Firestore, useValue: {} },
        { provide: Auth, useValue: mockAuth },
      ],
    });

    service = TestBed.inject(ResourceService);
    jest.clearAllMocks();
    (afs.collectionData as jest.Mock).mockReturnValue(of([]));
  });

  describe('getResources()', () => {
    it('queries users/{uid}/resources ordered by createdAt desc, limit 200', () => {
      service.getResources();

      expect(fbfs.collection).toHaveBeenCalledWith(expect.anything(), 'users/u1/resources');
      expect(fbfs.orderBy).toHaveBeenCalledWith('createdAt', 'desc');
      expect(fbfs.limit).toHaveBeenCalledWith(200);
      expect(afs.collectionData).toHaveBeenCalledWith(expect.anything(), { idField: 'id' });
    });

    it('returns an Observable', () => {
      const result = service.getResources();
      expect(result.subscribe).toBeDefined();
    });
  });

  describe('getSessionResources()', () => {
    it('queries the session resources subcollection ordered by pinnedAt asc', () => {
      service.getSessionResources('sess1');

      expect(fbfs.collection).toHaveBeenCalledWith(
        expect.anything(),
        'users/u1/sessions/sess1/resources'
      );
      expect(fbfs.orderBy).toHaveBeenCalledWith('pinnedAt', 'asc');
    });
  });

  describe('saveResources()', () => {
    const newResource = {
      type: 'youtube' as const,
      url: 'https://www.youtube.com/watch?v=abc',
      label: 'Test video',
      tags: ['blues'],
    };

    it('creates a global library doc and a session pin for a new resource (no dedup hit)', async () => {
      (fbfs.getDocs as jest.Mock).mockResolvedValue({ empty: true, docs: [] });

      await service.saveResources('sess1', [newResource]);

      // dedup query ran
      expect(fbfs.getDocs).toHaveBeenCalledTimes(1);
      // addDoc called twice: global lib + session pin
      expect(fbfs.addDoc).toHaveBeenCalledTimes(2);
    });

    it('reuses existing global doc when URL dedup finds a match', async () => {
      (fbfs.getDocs as jest.Mock).mockResolvedValue({
        empty: false,
        docs: [{ id: 'existing-id' }],
      });

      await service.saveResources('sess1', [newResource]);

      // no new global lib doc created
      expect(fbfs.addDoc).toHaveBeenCalledTimes(1); // only session pin
      // touchResource called via updateDoc
      expect(fbfs.updateDoc).toHaveBeenCalledTimes(1);
    });

    it('touches an existing resource (has resourceId) and writes session pin', async () => {
      const existingResource = { ...newResource, resourceId: 'res42' };

      await service.saveResources('sess1', [existingResource]);

      // no dedup query needed
      expect(fbfs.getDocs).not.toHaveBeenCalled();
      // updateDoc from touchResource + addDoc for session pin
      expect(fbfs.updateDoc).toHaveBeenCalledTimes(1);
      expect(fbfs.addDoc).toHaveBeenCalledTimes(1);
    });

    it('sets pinnedAt via serverTimestamp on the session pin', async () => {
      (fbfs.getDocs as jest.Mock).mockResolvedValue({ empty: true, docs: [] });

      await service.saveResources('sess1', [newResource]);

      const pinCall = (fbfs.addDoc as jest.Mock).mock.calls[1];
      expect(pinCall[1]).toMatchObject({ pinnedAt: 'server-ts' });
    });
  });

  describe('deleteResource()', () => {
    it('calls deleteDoc on users/{uid}/resources/{id}', async () => {
      await service.deleteResource('res1');

      expect(fbfs.doc).toHaveBeenCalledWith(expect.anything(), 'users/u1/resources/res1');
      expect(fbfs.deleteDoc).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateResource()', () => {
    it('calls updateDoc with label and tags changes', async () => {
      await service.updateResource('res1', { label: 'Updated', tags: ['rock'] });

      expect(fbfs.doc).toHaveBeenCalledWith(expect.anything(), 'users/u1/resources/res1');
      expect(fbfs.updateDoc).toHaveBeenCalledWith(
        expect.anything(),
        { label: 'Updated', tags: ['rock'] }
      );
    });
  });

  describe('touchResource()', () => {
    it('increments useCount and sets lastUsedAt to serverTimestamp', async () => {
      await service.touchResource('res1');

      expect(fbfs.doc).toHaveBeenCalledWith(expect.anything(), 'users/u1/resources/res1');
      expect(fbfs.updateDoc).toHaveBeenCalledWith(expect.anything(), {
        useCount: { _increment: 1 },
        lastUsedAt: 'server-ts',
      });
    });
  });

  describe('uid()', () => {
    it('throws when no user is authenticated', () => {
      (mockAuth as any).currentUser = null;
      expect(() => service.getResources()).toThrow('No authenticated user');
    });
  });
});
