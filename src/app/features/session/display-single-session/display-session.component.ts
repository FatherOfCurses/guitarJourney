import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { SessionService } from "../../../services/session.service";
import { takeWhile } from "rxjs/operators";
import { Session } from "../../../models/session";

@Component({
    selector: 'app-display-single-session',
    templateUrl: './display-session.component.html',
    styleUrls: ['./display-session.component.scss'],
    standalone: false
})
export class DisplaySessionComponent implements OnInit {
  session: Session;
  componentIsAlive = false;

  constructor(private router: Router, private route: ActivatedRoute, private sessionService: SessionService) { }

  ngOnInit(): void {
    this.componentIsAlive = true;
    this.route.paramMap
      .pipe(takeWhile(() => this.componentIsAlive))
      .subscribe((params) => {
        const sessionId = params.get('id');
        this.getSession(sessionId);
      })
  }

  getSession(id: string) {
    console.log(`Getting sessionId ${id}`)
    this.sessionService.getSession$(id).subscribe(session => this.session = session);
    console.log(this.session)
  }

  returnToTable() {
    this.router.navigate(['session']).then();
  }
}
