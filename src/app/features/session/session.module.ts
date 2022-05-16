import {NgModule} from '@angular/core';
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
import { CdTimerModule } from 'angular-cd-timer';
import { CommonModule, DatePipe } from '@angular/common';
import { CountdownModule} from 'ngx-countdown';
import { TimerComponent } from './timer/timer.component';
import { DisplaySessionComponent } from './display-single-session/display-session.component';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';


@NgModule({
  declarations: [
    TimerComponent,
    DisplaySessionComponent
  ],
  imports: [
    NbStepperModule,
    NbInputModule,
    NbLayoutModule,
    ReactiveFormsModule,
    FormsModule,
    NbCardModule,
    CommonModule,
    NbButtonModule,
    NbTableModule,
    NbProgressBarModule,
    CountdownModule,
    CdTimerModule,
    NbTreeGridModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
  ],
  providers: [DatePipe],
  exports: [TimerComponent]
})
export class SessionModule { }
