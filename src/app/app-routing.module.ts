import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingPageComponent } from './features/landing-page/landing-page.component';
import { SessionBeforeComponent } from './features/session/session-1-before/session-before.component';
import {SessionAfterComponent} from './features/session/session-3-after/session-after.component';
import {SessionDuringComponent} from './features/session/session-2-during/session-during.component';


const routes: Routes = [
  {path: '', component: LandingPageComponent},
  {path: 'session', component: SessionBeforeComponent},
  {path: 'sessionDuring', component: SessionDuringComponent},
  {path: 'sessionAfter', component: SessionAfterComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
