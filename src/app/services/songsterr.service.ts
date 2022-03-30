import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SongsterrResponse } from '../models/songsterrResponse';
import { json } from 'express';

@Injectable({
  providedIn: 'root'
})
export class SongsterrService {
  private readonly BASE_URL = 'http://www.songsterr.com/a/ra/';
  private readonly BASE_ID_URL = 'http://www.songsterr.com/a/wa/';

  constructor(private httpClient: HttpClient) {}

  getSearchResults(searchString: string): Observable<SongsterrResponse[]> {
    return this.httpClient.get<SongsterrResponse[]>
    (`${this.BASE_URL}songs.json?pattern=${searchString}`)
      .pipe(tap(songsterrResponse => console.log('Response:', songsterrResponse.concat())));
  }

  getSongById(songId: string): Observable<string> {
    return this.httpClient.get<string>
    (`${this.BASE_ID_URL}song?id=${songId}`)
  }
}
