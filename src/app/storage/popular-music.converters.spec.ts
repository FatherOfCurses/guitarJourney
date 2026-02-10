import {
  popularArtistConverter,
  popularAlbumConverter,
  popularSongConverter,
} from './popular-music.converters';
import type { PopularArtist, PopularAlbum, PopularSong } from '../models/popular-music';

describe('Popular music converters', () => {
  describe('popularArtistConverter', () => {
    it('toFirestore lowercases sortName and omits id', () => {
      const artist: PopularArtist = { name: 'The Beatles', sortName: 'The Beatles' };
      const doc = popularArtistConverter.toFirestore(artist);
      expect(doc).toEqual({ name: 'The Beatles', sortName: 'the beatles' });
      expect('id' in (doc as any)).toBe(false);
    });

    it('fromFirestore returns { id, ...data }', () => {
      const snap = { id: 'the-beatles', data: () => ({ name: 'The Beatles', sortName: 'the beatles' }) } as any;
      const result = popularArtistConverter.fromFirestore(snap);
      expect(result).toEqual({ id: 'the-beatles', name: 'The Beatles', sortName: 'the beatles' });
    });
  });

  describe('popularAlbumConverter', () => {
    it('toFirestore lowercases sortTitle and omits id', () => {
      const album: PopularAlbum = { title: 'Abbey Road', artist: 'The Beatles', sortTitle: 'Abbey Road' };
      const doc = popularAlbumConverter.toFirestore(album);
      expect(doc).toEqual({ title: 'Abbey Road', artist: 'The Beatles', sortTitle: 'abbey road' });
      expect('id' in (doc as any)).toBe(false);
    });

    it('fromFirestore returns { id, ...data }', () => {
      const snap = { id: 'abbey-road', data: () => ({ title: 'Abbey Road', artist: 'The Beatles', sortTitle: 'abbey road' }) } as any;
      const result = popularAlbumConverter.fromFirestore(snap);
      expect(result).toEqual({ id: 'abbey-road', title: 'Abbey Road', artist: 'The Beatles', sortTitle: 'abbey road' });
    });
  });

  describe('popularSongConverter', () => {
    it('toFirestore lowercases sortTitle and omits id', () => {
      const song: PopularSong = { title: 'Blackbird', artist: 'The Beatles', sortTitle: 'Blackbird' };
      const doc = popularSongConverter.toFirestore(song);
      expect(doc).toEqual({ title: 'Blackbird', artist: 'The Beatles', sortTitle: 'blackbird' });
      expect('id' in (doc as any)).toBe(false);
    });

    it('fromFirestore returns { id, ...data }', () => {
      const snap = { id: 'blackbird', data: () => ({ title: 'Blackbird', artist: 'The Beatles', sortTitle: 'blackbird' }) } as any;
      const result = popularSongConverter.fromFirestore(snap);
      expect(result).toEqual({ id: 'blackbird', title: 'Blackbird', artist: 'The Beatles', sortTitle: 'blackbird' });
    });
  });
});
