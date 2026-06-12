// src/app/models/converters.spec.ts
import {
    sessionConverter,
    songConverter,
    userDocumentConverter,
    resourceConverter,
    sessionResourceConverter,
    type Session,
    type Song,
    type UserDocument,
  } from './converters';
import type { Resource } from '../models/resource';
import type { SessionResource } from '../models/session-resource';
  

  
  describe('Firestore converters', () => {
    describe('sessionConverter', () => {
      it('toFirestore maps optional fields to null and preserves Timestamp', () => {
          // We don't need a real Firestore Timestamp for these tests—just a placeholder object.
        const ts: any = { seconds: 1, nanoseconds: 0 };
        const s: Session = {
          ownerUid: 'u1',
          date: ts,
          practiceTime: 45,
          // omit all optionals
        };
  
        const doc = sessionConverter.toFirestore(s);
  
        expect(doc).toEqual({
          ownerUid: 'u1',
          date: ts,
          practiceTime: 45,
          whatToPractice: null,
          sessionIntent: null,
          postPracticeReflection: null,
          goalForNextTime: null,
        });
        expect('id' in (doc as any)).toBe(false); // id should never be written
      });
  
      it('toFirestore keeps provided optional fields (not nulling them)', () => {
          // We don't need a real Firestore Timestamp for these tests—just a placeholder object.
        const ts: any = { seconds: 1, nanoseconds: 0 };
        const s: Session = {
          ownerUid: 'u2',
          date: ts,
          practiceTime: 30,
          whatToPractice: 'Scales',
          sessionIntent: 'Accuracy',
          postPracticeReflection: 'Felt good',
          goalForNextTime: 'Tempo up',
        };
  
        const doc = sessionConverter.toFirestore(s);
  
        expect(doc).toEqual({
          ownerUid: 'u2',
          date: ts,
          practiceTime: 30,
          whatToPractice: 'Scales',
          sessionIntent: 'Accuracy',
          postPracticeReflection: 'Felt good',
          goalForNextTime: 'Tempo up',
        });
      });
  
      it('fromFirestore returns {id, ...data}', () => {
          // We don't need a real Firestore Timestamp for these tests—just a placeholder object.
        const ts: any = { seconds: 1, nanoseconds: 0 };
        const snap = {
          id: 's123',
          data: () => ({
            ownerUid: 'u1',
            date: ts,
            practiceTime: 20,
            whatToPractice: null,
            sessionIntent: null,
            postPracticeReflection: null,
            goalForNextTime: null,
          }),
        } as any;
  
        const result = sessionConverter.fromFirestore(snap);
        expect(result).toEqual({
          id: 's123',
          ownerUid: 'u1',
          date: ts,
          practiceTime: 20,
          whatToPractice: null,
          sessionIntent: null,
          postPracticeReflection: null,
          goalForNextTime: null,
        });
      });
    });
  
    describe('songConverter', () => {
      it('toFirestore lowercases sort fields and defaults from title/artist when missing', () => {
        const song: Song = {
          ownerUid: 'u1',
          title: 'Blackbird',
          artist: 'The Beatles',
          // no sortTitle/sortArtist provided
        };

        const doc = songConverter.toFirestore(song);

        expect(doc).toEqual({
          ownerUid: 'u1',
          title: 'Blackbird',
          artist: 'The Beatles',
          album: null,
          genre: null,
          audioLink: null,
          videoLink: null,
          notationLinks: [],
          appleMusicLink: null,
          spotifyLink: null,
          sortTitle: 'blackbird',
          sortArtist: 'the beatles',
        });
        expect('id' in (doc as any)).toBe(false);
      });

      it('toFirestore uses provided sort fields, lowercased', () => {
        const song: Song = {
          ownerUid: 'u2',
          title: 'Stairway To Heaven',
          artist: 'Led Zeppelin',
          sortTitle: 'STAIRWAY to heaven',
          sortArtist: 'LED ZEPPELIN',
          genre: 'Rock',
          spotifyLink: 'https://open.spotify.com/track/xyz',
        };

        const doc = songConverter.toFirestore(song);

        expect(doc.sortTitle).toBe('stairway to heaven');
        expect(doc.sortArtist).toBe('led zeppelin');
        expect(doc.genre).toBe('Rock');
        expect(doc.appleMusicLink).toBeNull();
        expect(doc.spotifyLink).toBe('https://open.spotify.com/track/xyz');
      });
  
      it('fromFirestore returns {id, ...data}', () => {
        const snap = {
          id: 'song42',
          data: () => ({
            title: 'Creep',
            artist: 'Radiohead',
            genre: 'Alt',
            appleMusicLink: null,
            spotifyLink: 'https://open.spotify.com/track/abc',
            sortTitle: 'creep',
            sortArtist: 'radiohead',
          }),
        } as any;
  
        const result = songConverter.fromFirestore(snap);
        expect(result).toEqual({
          id: 'song42',
          title: 'Creep',
          artist: 'Radiohead',
          genre: 'Alt',
          appleMusicLink: null,
          spotifyLink: 'https://open.spotify.com/track/abc',
          sortTitle: 'creep',
          sortArtist: 'radiohead',
        });
      });
    });
  
    describe('userDocumentConverter', () => {
      it('toFirestore maps description to null when omitted', () => {
        const docModel: UserDocument = {
          ownerUid: 'u9',
          title: 'Chart PDF',
          storagePath: 'users/u9/docs/d1.pdf',
        };
  
        const doc = userDocumentConverter.toFirestore(docModel);
  
        expect(doc).toEqual({
          ownerUid: 'u9',
          title: 'Chart PDF',
          description: null,
          storagePath: 'users/u9/docs/d1.pdf',
        });
        expect('id' in (doc as any)).toBe(false);
      });
  
      it('fromFirestore returns {id, ...data}', () => {
        const snap = {
          id: 'doc7',
          data: () => ({
            ownerUid: 'u9',
            title: 'Setlist',
            description: 'October show',
            storagePath: 'users/u9/docs/doc7.pdf',
          }),
        } as any;
  
        const result = userDocumentConverter.fromFirestore(snap);
        expect(result).toEqual({
          id: 'doc7',
          ownerUid: 'u9',
          title: 'Setlist',
          description: 'October show',
          storagePath: 'users/u9/docs/doc7.pdf',
        });
      });
    });

    describe('resourceConverter', () => {
      const ts: any = { seconds: 1000, nanoseconds: 0 };

      it('toFirestore maps optional fields to defaults and never includes id', () => {
        const r: Resource = {
          type: 'youtube',
          url: 'https://www.youtube.com/watch?v=abc',
          label: 'Intro to barre chords',
          createdAt: ts,
        };

        const doc = resourceConverter.toFirestore(r);

        expect(doc).toEqual({
          type: 'youtube',
          url: 'https://www.youtube.com/watch?v=abc',
          label: 'Intro to barre chords',
          tags: [],
          useCount: 0,
          lastUsedAt: null,
          createdAt: ts,
        });
        expect('id' in (doc as any)).toBe(false);
      });

      it('toFirestore preserves provided tags, useCount, and lastUsedAt', () => {
        const ts2: any = { seconds: 2000, nanoseconds: 0 };
        const r: Resource = {
          type: 'pdf',
          url: 'https://example.com/tab.pdf',
          label: 'Tab sheet',
          tags: ['blues', 'scale'],
          useCount: 5,
          lastUsedAt: ts2,
          createdAt: ts,
        };

        const doc = resourceConverter.toFirestore(r);

        expect(doc.tags).toEqual(['blues', 'scale']);
        expect(doc.useCount).toBe(5);
        expect(doc.lastUsedAt).toBe(ts2);
      });

      it('fromFirestore returns { id, ...data }', () => {
        const snap = {
          id: 'res1',
          data: () => ({
            type: 'youtube',
            url: 'https://www.youtube.com/watch?v=abc',
            label: 'Barre chords',
            tags: ['chords'],
            useCount: 2,
            lastUsedAt: null,
            createdAt: ts,
          }),
        } as any;

        const result = resourceConverter.fromFirestore(snap);
        expect(result.id).toBe('res1');
        expect(result.type).toBe('youtube');
        expect(result.label).toBe('Barre chords');
      });
    });

    describe('sessionResourceConverter', () => {
      const ts: any = { seconds: 3000, nanoseconds: 0 };

      it('toFirestore maps resourceId to null when omitted and never includes id', () => {
        const r: SessionResource = {
          type: 'custom',
          url: 'https://example.com',
          label: 'Reference',
          pinnedAt: ts,
        };

        const doc = sessionResourceConverter.toFirestore(r);

        expect(doc).toEqual({
          resourceId: null,
          type: 'custom',
          url: 'https://example.com',
          label: 'Reference',
          tags: [],
          pinnedAt: ts,
        });
        expect('id' in (doc as any)).toBe(false);
      });

      it('toFirestore preserves resourceId and tags when provided', () => {
        const r: SessionResource = {
          resourceId: 'res42',
          type: 'pdf',
          url: 'https://example.com/tab.pdf',
          label: 'Tab',
          tags: ['blues'],
          pinnedAt: ts,
        };

        const doc = sessionResourceConverter.toFirestore(r);

        expect(doc.resourceId).toBe('res42');
        expect(doc.tags).toEqual(['blues']);
      });

      it('fromFirestore returns { id, ...data }', () => {
        const snap = {
          id: 'pin1',
          data: () => ({
            resourceId: 'res99',
            type: 'youtube',
            url: 'https://www.youtube.com/watch?v=xyz',
            label: 'Justin Guitar',
            tags: [],
            pinnedAt: ts,
          }),
        } as any;

        const result = sessionResourceConverter.fromFirestore(snap);
        expect(result.id).toBe('pin1');
        expect(result.resourceId).toBe('res99');
      });
    });
  });
