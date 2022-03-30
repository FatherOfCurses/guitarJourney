import {NgModule} from '@angular/core';
import {
  NbButtonModule,
  NbCardModule,
  NbInputModule,
  NbLayoutModule,
  NbProgressBarModule,
  NbStepperModule,
  NbTableModule
} from '@nebular/theme';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { CdTimerModule } from 'angular-cd-timer';
import {CommonModule} from '@angular/common';
import { CountdownModule} from 'ngx-countdown';
import { TimerComponent } from './timer/timer.component';

@NgModule({
  declarations: [
    TimerComponent
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
    CdTimerModule
  ],
  providers: [],
  exports: [TimerComponent]
})
export class SessionModule { }
