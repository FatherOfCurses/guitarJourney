import { Injectable } from '@angular/core';
import {
  Firestore,
  collectionData,
  collection,
  doc,
  query,
  where,
  orderBy,
  limit,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  increment,
} from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { Resource } from '../models/resource';
import { SessionResource } from '../models/session-resource';
import { resourceConverter, sessionResourceConverter } from '../storage/converters';

@Injectable({ providedIn: 'root' })
export class ResourceService {
  constructor(private fs: Firestore, private auth: Auth) {}

  private uid(): string {
    const uid = this.auth.currentUser?.uid;
    if (!uid) throw new Error('No authenticated user');
    return uid;
  }

  getResources(): Observable<Resource[]> {
    const uid = this.uid();
    const db = this.fs;
    const col = collection(db, `users/${uid}/resources`).withConverter(resourceConverter);
    const q = query(col, orderBy('createdAt', 'desc'), limit(200));
    return collectionData(q, { idField: 'id' }) as unknown as Observable<Resource[]>;
  }

  getSessionResources(sessionId: string): Observable<SessionResource[]> {
    const uid = this.uid();
    const db = this.fs;
    const col = collection(db, `users/${uid}/sessions/${sessionId}/resources`).withConverter(
      sessionResourceConverter
    );
    const q = query(col, orderBy('pinnedAt', 'asc'));
    return collectionData(q, { idField: 'id' }) as unknown as Observable<SessionResource[]>;
  }

  async saveResources(
    sessionId: string,
    resources: Omit<SessionResource, 'id' | 'pinnedAt'>[]
  ): Promise<void> {
    const uid = this.uid();
    const db = this.fs;

    for (const resource of resources) {
      let globalResourceId: string;

      if (!resource.resourceId) {
        const dupQ = query(
          collection(db, `users/${uid}/resources`),
          where('url', '==', resource.url),
          limit(1)
        );
        const existing = await getDocs(dupQ);

        if (!existing.empty) {
          globalResourceId = existing.docs[0].id;
          await this.touchResource(globalResourceId);
        } else {
          const ref = await addDoc(
            collection(db, `users/${uid}/resources`).withConverter(resourceConverter),
            {
              type: resource.type,
              url: resource.url,
              label: resource.label,
              tags: resource.tags ?? [],
              createdAt: serverTimestamp(),
              useCount: 0,
            } as any
          );
          globalResourceId = ref.id;
        }
      } else {
        globalResourceId = resource.resourceId;
        await this.touchResource(globalResourceId);
      }

      await addDoc(
        collection(db, `users/${uid}/sessions/${sessionId}/resources`).withConverter(
          sessionResourceConverter
        ),
        {
          resourceId: globalResourceId,
          type: resource.type,
          url: resource.url,
          label: resource.label,
          tags: resource.tags ?? [],
          pinnedAt: serverTimestamp(),
        } as any
      );
    }
  }

  async deleteResource(resourceId: string): Promise<void> {
    const uid = this.uid();
    const db = this.fs;
    await deleteDoc(doc(db, `users/${uid}/resources/${resourceId}`));
  }

  async updateResource(
    resourceId: string,
    changes: Partial<Pick<Resource, 'label' | 'tags'>>
  ): Promise<void> {
    const uid = this.uid();
    const db = this.fs;
    await updateDoc(doc(db, `users/${uid}/resources/${resourceId}`), changes);
  }

  async touchResource(resourceId: string): Promise<void> {
    const uid = this.uid();
    const db = this.fs;
    await updateDoc(doc(db, `users/${uid}/resources/${resourceId}`), {
      useCount: increment(1),
      lastUsedAt: serverTimestamp(),
    });
  }
}
