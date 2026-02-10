export interface Song {
  id?: string;
  ownerUid: string;
  title: string;
  artist: string;
  album?: string;
  genre?: string;
  audioLink?: string;
  videoLink?: string;
  notationLinks?: string[];
  appleMusicLink?: string;
  spotifyLink?: string;
  sortTitle?: string;
  sortArtist?: string;
}
