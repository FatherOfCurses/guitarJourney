// songs.service.ts (sketch)
import { getFirestore, collection, query, orderBy, limit } from 'firebase/firestore';
import { songConverter } from '../storage/converters';
import { Song } from '../models/song';
import { Observable } from "rxjs";
import { collectionData } from "@angular/fire/firestore/lite";

export class SongsService {
  private db = getFirestore();
  list(pageSize = 100) {
    const col = collection(this.db, 'songs').withConverter(songConverter);
    const q = query(col, orderBy('title'), orderBy('artist'), limit(pageSize));
    return collectionData(q, { idField: 'id' }) as any as Observable<Song[]>;
  }
}
