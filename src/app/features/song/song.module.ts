import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SongComponent } from './song.component';
import { SongsterrService } from '../../services/songsterr.service';
import { ButtonModule } from "primeng/button";

@NgModule({
  declarations: [
    SongComponent
  ],
  imports: [
    CommonModule,
    ButtonModule
  ]
})
export class SongModule { }
