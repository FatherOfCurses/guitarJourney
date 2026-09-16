import { Timestamp } from 'firebase/firestore';

export interface SessionResource {
  id?: string;
  resourceId?: string;  // FK to users/{uid}/resources/{id}; undefined until saveResources() resolves
  type: 'youtube' | 'pdf' | 'chord-sheet' | 'custom' | 'song';
  url?: string;         // optional for song type (may have no single canonical URL)
  label: string;
  tags?: string[];
  pinnedAt: Timestamp;
  // Song-specific fields
  title?: string;
  artist?: string;
  album?: string;
  genre?: string;
  audioLink?: string;
  videoLink?: string;
  appleMusicLink?: string;
  spotifyLink?: string;
  notationLinks?: string[];
}
