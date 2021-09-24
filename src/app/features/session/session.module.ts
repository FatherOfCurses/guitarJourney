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
import {SessionBeforeComponent} from './session-1-before/session-before.component';
import {SessionDuringComponent} from './session-2-during/session-during.component';
import {CommonModule} from '@angular/common';
import { SessionAfterComponent } from './session-3-after/session-after.component';
import { CountdownModule} from 'ngx-countdown';
import { TimerComponent } from './timer/timer.component';

@NgModule({
  declarations: [
    SessionBeforeComponent,
    SessionDuringComponent,
    SessionAfterComponent,
    TimerComponent,
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
    CountdownModule
  ],
  providers: [],
})
export class SessionModule { }
