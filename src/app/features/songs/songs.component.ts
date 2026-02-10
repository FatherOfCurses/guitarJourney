import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { Song } from '@models/song';
import { SongsService } from '@services/songs.service';

@Component({
  selector: 'app-songs',
  standalone: true,
  imports: [TableModule, ButtonModule],
  templateUrl: './songs.component.html',
})
export class SongsComponent implements OnInit {
  songData: Song[] = [];
  selectedSong: Song | null = null;

  constructor(private songsService: SongsService, private router: Router) {}

  ngOnInit(): void {
    this.songsService.list$().subscribe(songs => this.songData = songs);
  }

  onRowSelect(event: any): void {
    this.router.navigate(['/app', 'songDetail', event.data.id]);
  }

  addSong(): void {
    this.router.navigate(['/app', 'newSong']);
  }
}
