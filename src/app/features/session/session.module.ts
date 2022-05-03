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
import {CommonModule} from '@angular/common';
import { CountdownModule} from 'ngx-countdown';
import { TimerComponent } from './timer/timer.component';
import { DisplaySessionComponent } from './display-single-session/display-session.component';

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
    NbTreeGridModule
  ],
  providers: [],
  exports: [TimerComponent]
})
export class SessionModule { }
