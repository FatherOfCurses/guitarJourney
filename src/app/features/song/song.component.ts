import { Component, OnInit } from '@angular/core';
import { SongsterrService } from '../../services/songsterr.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-song',
  templateUrl: './song.component.html',
  styleUrls: ['./song.component.scss']
})
export class SongComponent implements OnInit {
  searchResult: Observable<any>;

  constructor(private songService: SongsterrService) { }

  ngOnInit(): void {
    this.searchResult = this.songService.getSearchResults('Marley');
  console.log(this.searchResult.pipe());
  }

}
