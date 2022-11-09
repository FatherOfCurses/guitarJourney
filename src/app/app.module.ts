import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { LandingPageComponent } from './features/landing-page/landing-page.component';
import {HeaderComponent} from './core/header/header.component';
import {FooterComponent} from './core/footer/footer.component';
import {NavigationComponent} from './core/navigation/navigation.component';
import {RouterModule} from '@angular/router';
import {SessionModule} from './features/session/session.module';
import { Convertors } from './utilities/Convertors';
import { ChordComponent } from './features/notation/chord/chord.component';
import { HttpClientModule } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StyleClassModule } from 'primeng/styleclass';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { CdTimerModule } from "angular-cd-timer";

@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    HeaderComponent,
    FooterComponent,
    NavigationComponent,
    ChordComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SessionModule,
    ReactiveFormsModule,
    FormsModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    RouterModule,
    HttpClientModule,
    // PrimeNG
    ButtonModule,
    InputTextModule,
    StyleClassModule,
    MenuModule,
    MenubarModule,
    CdTimerModule
  ],
  providers: [Convertors],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
