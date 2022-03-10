import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-session-after',
  templateUrl: './session-after.component.html',
  styleUrls: ['./session-after.component.scss']
})
export class SessionAfterComponent implements OnInit {
  @Input() sessionForm: FormGroup

  constructor() { }

  ngOnInit(): void {
  }

}
