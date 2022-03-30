import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SongComponent } from './song.component';
import { NbLayoutModule } from '@nebular/theme';
import { SongsterrService } from '../../services/songsterr.service';

@NgModule({
  declarations: [
    SongComponent
  ],
  imports: [
    CommonModule,
    NbLayoutModule
  ],
})
export class SongModule { }
