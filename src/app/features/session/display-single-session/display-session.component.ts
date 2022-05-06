import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-display-single-session',
  templateUrl: './display-session.component.html',
  styleUrls: ['./display-session.component.scss']
})
export class DisplaySessionComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  returnToTable() {
    this.router.navigate(['session']).then();
  }
}
