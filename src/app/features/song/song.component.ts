import { Component, OnInit } from '@angular/core';
import { SongsterrService } from '../../services/songsterr.service';
import { SongsterrResponse } from '../../models/songsterrResponse';
import { Observable } from 'rxjs';
import { MessageService } from "primeng/api";

@Component({
  selector: 'app-song',
  templateUrl: './song.component.html',
  providers: [ MessageService, SongsterrService ],
  styleUrls: ['./song.component.scss']
})
export class SongComponent implements OnInit {
  searchResult$: Observable<SongsterrResponse[]>;
  uploadModalVisible: boolean;

  constructor(private songService: SongsterrService, private messageService: MessageService) {
  }

  ngOnInit(): void {
    this.searchResult$ = this.songService.getSearchResults$('Marley');
  }

  getSongs(callback): void {
    this.songService.getSearchResults$('Marley').pipe().subscribe(callback);
  }

  openUploadModal() {
    this.uploadModalVisible = true;
  }

  onUpload(event) {
    this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded with Basic Mode' });
  }
}
