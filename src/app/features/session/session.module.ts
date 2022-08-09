import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import {
  NbButtonModule,
  NbCardModule,
  NbInputModule,
  NbLayoutModule,
  NbProgressBarModule,
  NbStepperModule,
  NbTableModule,
  NbTreeGridModule
} from '@nebular/theme';
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

@NgModule({
  declarations: [
    SessionTimerComponent,
    DisplaySessionComponent,
    PreviousSessionsComponent,
    SessionComponent
  ],
  imports: [
    NbStepperModule,
    NbInputModule,
    NbLayoutModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    NbCardModule,
    CommonModule,
    NbButtonModule,
    NbTableModule,
    NbProgressBarModule,
    NbTreeGridModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
  ],
  providers: [DatePipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SessionModule { }
