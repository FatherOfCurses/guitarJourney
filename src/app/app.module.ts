import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {
  NbA11yModule,
  NbButtonModule,
  NbCardModule,
  NbLayoutModule,
  NbListModule,
  NbMenuModule,
  NbSidebarModule, NbTableModule,
  NbThemeModule
} from '@nebular/theme';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { LandingPageComponent } from './features/landing-page/landing-page.component';
import {HeaderComponent} from './base/header/header.component';
import {FooterComponent} from './base/footer/footer.component';
import {SidebarComponent} from './base/sidebar/sidebar.component';
import {RouterModule} from '@angular/router';
import {routes} from '@nebular/auth';
import {SidebarModule} from './base/sidebar/sidebar.module';
import {SessionModule} from './features/session/session.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SessionComponent} from './features/session/session.component';
import { Convertors } from './utilities/Convertors';
import { ChordComponent } from './features/notation/chord/chord.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    SessionComponent,
    ChordComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SidebarModule,
    SessionModule,
    ReactiveFormsModule,
    FormsModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    RouterModule.forRoot(routes, { useHash: true }),
    NbThemeModule.forRoot(),
    NbSidebarModule.forRoot(),
    NbMenuModule.forRoot(),
    NbA11yModule.forRoot(),
    NbButtonModule,
    NbLayoutModule,
    NbCardModule,
    NbListModule,
    NbTableModule,
    HttpClientModule
  ],
  providers: [Convertors, HttpClient],
  bootstrap: [AppComponent]
})
export class AppModule { }
