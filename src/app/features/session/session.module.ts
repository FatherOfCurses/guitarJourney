import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { SessionTimerComponent } from './session-timer/session-timer.component';
import { DisplaySessionComponent } from './display-single-session/display-session.component';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { PreviousSessionsComponent } from './previous-sessions/previous-sessions.component';
import { MatInputModule } from '@angular/material/input';
import { SessionComponent } from './session.component';
import { CdTimerModule } from "angular-cd-timer";

@NgModule({
  declarations: [
    SessionTimerComponent,
    DisplaySessionComponent,
    PreviousSessionsComponent,
    SessionComponent
  ],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    CdTimerModule
  ],
  providers: [DatePipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SessionModule { }
