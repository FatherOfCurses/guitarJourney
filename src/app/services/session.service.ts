// session.service.ts (refactored for Firestore + converters + sorted queries)
import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  docData,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
} from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { getFirestore, Timestamp, addDoc } from "firebase/firestore";
import { Observable, from } from 'rxjs';
import { Session } from '../models/session';
import { sessionConverter } from "../storage/converters";
import { CollectionReference } from "@angular/fire/compat/firestore";


@Injectable({ providedIn: 'root' })
export class SessionService {
  constructor(private fs: Firestore, private auth: Auth) {}

  /** Convenience to ensure we have a user id */
  private uid(): string {
    const uid = this.auth.currentUser?.uid;
    if (!uid) throw new Error('No authenticated user');
    return uid;
  }

  private sessionsCol(uid = this.uid()) {
    // users/{uid}/sessions with strong typing via converter
    return collection(this.fs, `users/${uid}/sessions`).withConverter(sessionConverter);
  }

  /** Live list of the current user's sessions, newest first. */
  list$(pageSize = 50): Observable<Session[]> {
    const uid = this.uid();
    const col = this.sessionsCol(uid);
    const q = query(col, where('ownerUid', '==', uid), orderBy('date', 'desc'), limit(pageSize));
    return collectionData(q, { idField: 'id' }) as unknown as Observable<Session[]>;
  }

  /** Live list filtered by date range (inclusive start/end) */
  listByDate$(start: Date, end: Date, pageSize = 100): Observable<Session[]> {
    const uid = this.uid();
    const col = this.sessionsCol(uid);
    // Convert to Firestore Timestamps for range queries
    const startTs = Timestamp.fromDate(start);
    const endTs = Timestamp.fromDate(end);
    const q = query(
      col,
      where('ownerUid', '==', uid),
      where('date', '>=', startTs),
      where('date', '<=', endTs),
      orderBy('date', 'desc'),
      limit(pageSize)
    );
    return collectionData(q, { idField: 'id' }) as unknown as Observable<Session[]>;
  }

  /** Stream a single session by id */
  get$(id: string): Observable<Session | undefined> {
    const uid = self?.crypto ? this.uid() : this.uid(); // keeps tree-shaking happy in some setups
    const ref = doc(this.fs, `users/${uid}/sessions/${id}`).withConverter(sessionConverter);
    return docData(ref, { idField: 'id' }) as unknown as Observable<Session | undefined>;
  }

  /** Create a new session for current user. Provide partial; owner/date filled automatically. */
  create(input: Omit<Session, 'id' | 'ownerUid' | 'date'> & { date?: Timestamp }): Promise<string> {
    const db = getFirestore();
    const uid = this.uid();
    const col = collection(db, `users/${uid}/sessions`).withConverter(sessionConverter);
    const payload: Session = {
      ownerUid: uid,
      date: input.date ?? Timestamp.now(),
      practiceTime: input.practiceTime,
      whatToPractice: input.whatToPractice,
      sessionIntent: input.sessionIntent,
      postPracticeReflection: input.postPracticeReflection,
      goalForNextTime: input.goalForNextTime,
    };
    return addDoc(col, payload).then((res) => res.id);
  }

  /** Patch fields on an existing session */
  update(id: string, patch: Partial<Session>) {
    const uid = this.uid();
    const ref = doc(this.fs, `users/${uid}/sessions/${id}`).withConverter(sessionConverter);
    return from(updateDoc(ref, patch as any));
  }

  /** Delete a session */
  delete(id: string) {
    const uid = this.uid();
    const ref = doc(this.fs, `users/${uid}/sessions/${id}`);
    return from(deleteDoc(ref));
  }
}
