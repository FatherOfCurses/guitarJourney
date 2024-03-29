import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {
  visible: true;
  uploadModalVisible: boolean;

  constructor() { }

  ngOnInit(): void {
  }

  openUploadModal() {
    this.uploadModalVisible = true;
  }
}
