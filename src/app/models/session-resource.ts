import { Timestamp } from 'firebase/firestore';

export interface SessionResource {
  id?: string;
  resourceId?: string;  // FK to users/{uid}/resources/{id}; undefined until saveResources() resolves
  type: 'youtube' | 'pdf' | 'chord-sheet' | 'custom';
  url: string;
  label: string;
  tags?: string[];
  pinnedAt: Timestamp;
}
