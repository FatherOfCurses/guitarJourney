import { Component, OnInit } from '@angular/core';
import { SessionService } from '../../services/session.service';

@Component({
    selector: 'app-landing-page',
    templateUrl: './landing-page.component.html',
    styleUrls: ['./landing-page.component.scss'],
    standalone: false
})
export class LandingPageComponent implements OnInit {

  constructor(private sessionService: SessionService) { }

  ngOnInit(): void {
    const sessionList = this.sessionService.getAllSessions$();
  }

}
