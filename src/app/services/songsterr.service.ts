import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { response } from 'express';

@Injectable({
  providedIn: 'root'
})
export class SongsterrService {
  private readonly BASE_URL = 'http://www.songsterr.com/a/ra/';

  constructor(private httpClient: HttpClient) {}

  getSearchResults(searchString: string): Observable<string> {
    return this.httpClient.get<string>
    (`${this.BASE_URL}songs.xml?pattern=${searchString}`).
    pipe(tap(data => JSON.stringify(data)));
  }
}
