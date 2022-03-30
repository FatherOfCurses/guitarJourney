import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingPageComponent } from './features/landing-page/landing-page.component';
import {SessionAfterComponent} from './features/session/session-3-after/session-after.component';
import {SessionDuringComponent} from './features/session/session-2-during/session-during.component';
import { SessionComponent } from './features/session/session.component';
import { ChordComponent } from './features/notation/chord/chord.component';
import { SongComponent } from './features/song/song.component';


const routes: Routes = [
  {path: '', component: LandingPageComponent},
  {path: 'dashboard', component: LandingPageComponent},
  {path: 'session', component: SessionComponent},
  {path: 'landing', component: LandingPageComponent},
  {path: 'sessionDuring', component: SessionDuringComponent},
  {path: 'sessionAfter', component: SessionAfterComponent},
  {path: 'test', component: ChordComponent},
  {path: 'songs', component: SongComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
