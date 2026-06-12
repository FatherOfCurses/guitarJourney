import { Timestamp } from 'firebase/firestore';

export interface Resource {
  id?: string;
  type: 'youtube' | 'pdf' | 'chord-sheet' | 'custom';
  url: string;
  label: string;
  tags?: string[];
  useCount?: number;
  lastUsedAt?: Timestamp;
  createdAt: Timestamp;
}
