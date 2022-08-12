import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SongComponent } from './song.component';
import { SongsterrService } from '../../services/songsterr.service';

@NgModule({
  declarations: [
    SongComponent
  ],
  imports: [
    CommonModule
  ],
})
export class SongModule { }
