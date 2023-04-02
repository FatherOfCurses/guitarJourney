import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-exercises',
  templateUrl: './exercises.component.html',
  styleUrls: ['./exercises.component.scss']
})
export class ExercisesComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  // TODO: NOT DRY! Is repeated in song component
  openUploadModal() {
    //open upload modal component
  }

}
