// src/app/models/converters.spec.ts
import {
    sessionConverter,
    songConverter,
    userDocumentConverter,
    type Session,
    type Song,
    type UserDocument,
  } from './converters';
  

  
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
          title: 'Blackbird',
          artist: 'The Beatles',
          // no sortTitle/sortArtist provided
        };
  
        const doc = songConverter.toFirestore(song);
  
        expect(doc).toEqual({
          title: 'Blackbird',
          artist: 'The Beatles',
          genre: null,
          appleMusicLink: null,
          spotifyLink: null,
          sortTitle: 'blackbird',
          sortArtist: 'the beatles',
        });
        expect('id' in (doc as any)).toBe(false);
      });
  
      it('toFirestore uses provided sort fields, lowercased', () => {
        const song: Song = {
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
  });
  