import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-session-during',
  templateUrl: './session-during.component.html',
  styleUrls: ['./session-during.component.scss']
})
export class SessionDuringComponent implements OnInit {


  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  finishSession(): void {
    this.router.navigate(['/sessionAfter']).then();
  }

}
