import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {
  NbA11yModule,
  NbButtonModule,
  NbCardModule, NbInputModule,
  NbLayoutModule,
  NbListModule,
  NbMenuModule,
  NbSidebarModule, NbStepperModule, NbTableModule,
  NbThemeModule, NbTreeGridModule
} from '@nebular/theme';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { LandingPageComponent } from './features/landing-page/landing-page.component';
import {HeaderComponent} from './core/header/header.component';
import {FooterComponent} from './core/footer/footer.component';
import {SidebarComponent} from './core/sidebar/sidebar.component';
import {RouterModule} from '@angular/router';
import {routes} from '@nebular/auth';
import {SessionModule} from './features/session/session.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { Convertors } from './utilities/Convertors';
import { ChordComponent } from './features/notation/chord/chord.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { SessionComponent } from './features/session/session.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    ChordComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
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
    NbStepperModule,
    NbTableModule,
    HttpClientModule,
    NbTreeGridModule
  ],
  providers: [Convertors, HttpClient],
  bootstrap: [AppComponent]
})
export class AppModule { }
