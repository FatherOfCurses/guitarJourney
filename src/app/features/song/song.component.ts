import { Component, OnInit } from '@angular/core';
import { SongsterrService } from '../../services/songsterr.service';
import { SongsterrResponse } from '../../models/songsterrResponse';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-song',
  templateUrl: './song.component.html',
  styleUrls: ['./song.component.scss']
})
export class SongComponent implements OnInit {
  searchResult$: Observable<SongsterrResponse[]>;

  constructor(private songService: SongsterrService) {
  }

  ngOnInit(): void {
    this.searchResult$ = this.songService.getSearchResults('Marley');
  }

  getSongs(callback): void {
    this.songService.getSearchResults('Marley').pipe().subscribe(callback);
  }
}
