import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { DisplaySessionComponent } from './display-single-session/display-session.component';
import { MatSortModule } from '@angular/material/sort';
import { PreviousSessionsComponent } from './previous-sessions/previous-sessions.component';
import { SessionComponent } from './session.component';
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { ChipsModule } from "primeng/chips";
import { InputTextareaModule } from "primeng/inputtextarea";
import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";
import { SessionResourceComponent } from "./session-resource/session-resource.component";
import { SessionResourcePickerComponent } from "./session-resource-picker/session-resource-picker.component";
import { ToastModule } from "primeng/toast";
import { CardModule } from "primeng/card";

@NgModule({ declarations: [
        DisplaySessionComponent,
        PreviousSessionsComponent,
        SessionResourceComponent,
        SessionResourcePickerComponent,
        SessionComponent
    ],
    exports: [
        DisplaySessionComponent,
        PreviousSessionsComponent,
        SessionComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA], imports: [ReactiveFormsModule,
        FormsModule,
        CommonModule,
        MatSortModule,
        ChipsModule,
        InputTextareaModule,
        TableModule,
        ButtonModule,
        ToastModule,
        CardModule], providers: [provideHttpClient(withInterceptorsFromDi())] })
export class SessionModule { }
