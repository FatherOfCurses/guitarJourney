// session.service.ts
import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData, setDoc, addDoc, updateDoc, deleteDoc, query, where, orderBy, limit } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Timestamp } from 'firebase/firestore';
import { from, map, switchMap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SessionService {
  constructor(private fs: Firestore, private auth: Auth) {}

  private userCol(path: string) {
    const uid = this.auth.currentUser?.uid!;
    return collection(this.fs, `users/${uid}/${path}`);
  }

  listRecent(limitN = 20) {
    const q = query(this.userCol('sessions'), orderBy('startedAt', 'desc'), limit(limitN));
    return collectionData(q, { idField: 'id' });
  }

  getById(id: string) {
    const uid = this.auth.currentUser?.uid!;
    return docData(doc(this.fs, `users/${uid}/sessions/${id}`), { idField: 'id' });
  }

  create(partial: any) {
    return from(addDoc(this.userCol('sessions'), {
      ...partial,
      startedAt: Timestamp.now()
    }));
  }

  update(id: string, patch: any) {
    const uid = this.auth.currentUser?.uid!;
    return from(updateDoc(doc(this.fs, `users/${uid}/sessions/${id}`), patch));
  }

  delete(id: string) {
    const uid = this.auth.currentUser?.uid!;
    return from(deleteDoc(doc(this.fs, `users/${uid}/sessions/${id}`)));
  }
}
