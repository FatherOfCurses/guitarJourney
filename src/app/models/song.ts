import { Session } from "./session";

export class Song {
  id: string;
  title: string;
  artist: string;
  genre?: string;
  appleMusicLink?: string;
  spotifyLink?: string;
  sessions: Session[];

}
