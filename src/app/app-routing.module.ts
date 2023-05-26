import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingPageComponent } from './features/landing-page/landing-page.component';
import { SessionComponent } from './features/session/session.component';
import { ChordComponent } from './features/notation/chord/chord.component';
import { SongComponent } from './features/song/song.component';
import { DisplaySessionComponent } from './features/session/display-single-session/display-session.component';
import { ExercisesComponent } from "./features/exercises/exercises.component";

const routes: Routes = [
  {path: '', component: LandingPageComponent},
  {path: 'dashboard', component: LandingPageComponent},
  {path: 'session', component: SessionComponent},
  {path: 'sessionDetail/:id', component: DisplaySessionComponent},
  {path: 'landing', component: LandingPageComponent},
  {path: 'test', component: ChordComponent},
  {path: 'songs', component: SongComponent},
  {path: 'notation', component: ChordComponent},
  {path: 'exercises', component: ExercisesComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
