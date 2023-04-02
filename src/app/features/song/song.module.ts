import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { SongComponent } from './song.component';
import { ButtonModule } from "primeng/button";
import { DialogModule } from "primeng/dialog";
import { FileUploadModule } from "primeng/fileupload";

@NgModule({
  declarations: [
    SongComponent
  ],
  imports: [
    CommonModule,
    ButtonModule,
    DialogModule,
    FileUploadModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SongModule { }
