import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MessageService } from "primeng/api";

@Component({
  selector: 'app-song',
  templateUrl: './song.component.html',
  providers: [ MessageService ],
  styleUrls: ['./song.component.scss']
})
export class SongComponent implements OnInit {

  constructor(private messageService: MessageService) {
  }

  ngOnInit(): void {
  }

  getSongs(): void {
    // need a song service to get all songs similar to previous session compoonent
  }

  onUpload(event) {
    this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded with Basic Mode' });
  }
}
