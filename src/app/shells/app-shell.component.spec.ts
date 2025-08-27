import { TestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component } from '@angular/core';
import {
  Routes,
  Router,
  RouterLink,
  RouterOutlet,
  provideRouter,
  convertToParamMap,
} from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { FirebaseApp } from '@angular/fire/app';
import { Auth, signOut } from '@angular/fire/auth';
import * as AngularFireAuth from '@angular/fire/auth';
import { FirebaseAppModule } from '@angular/fire/app';
import { AppShellComponent } from './app-shell.component';
import { DashboardComponent } from '../features/dashboard/dashboard.component';
import { SessionComponent } from '../features/session/session.component';
import { SongsComponent } from '../features/songs/songs.component';
import { MetricsComponent } from '../features/metrics/metrics.component';
import { Session } from '../models/session';
import { of, Subject } from 'rxjs';
import { SessionService } from '../services/session.service';

jest.mock('@angular/fire/auth', () => {
  // if you need other exports from the real module, spread them in:
  const actual = jest.requireActual('@angular/fire/auth');
  return {
    ...actual,
    signOut: jest.fn(),        // <-- make it a jest mock function
  };
});

const routes: Routes = [
  {
    path: 'app',
    component: AppShellComponent,
    children: [
      { path: 'home', component: DashboardComponent },
      { path: 'sessions', component: SessionComponent },
      { path: 'songs', component: SongsComponent },
      { path: 'metrics', component: MetricsComponent },
    ],
  },
];

//Session service mock setup

let paramMap$!: Subject<ReturnType<typeof convertToParamMap>>;

const makeSession = (over: Partial<Session> = {}): Session => ({
    id: '123',
    date: '2025-08-01',
    practiceTime: 35,
    whatToPractice: 'Pentatonics',
    sessionIntent: 'Speed & accuracy',
    postPracticeReflection: 'Felt good',
    goalForNextTime: 'Metronome +5bpm',
    ...(over as any)
  });

  let get$!: Subject<Session>;

  const sessionSvcMock: any = {
    getSessionById: jest.fn((id: string) => get$ ?? of(makeSession())),
    getById:         jest.fn((id: string) => get$ ?? of(makeSession())),
    findOne:         jest.fn((id: string) => get$ ?? of(makeSession())),
  };

  async function setup() {
    paramMap$ = new Subject();
    get$ = new Subject<Session>();
  }


describe('AppShellComponent', () => {
  let fixture: ComponentFixture<AppShellComponent>;
  let harness: RouterTestingHarness;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        // Import the standalone shell directly
        AppShellComponent
      ],
      providers: [
        // Modern router testing setup
        provideRouter(routes),
        { provide: FirebaseApp, useValue: {} },
        { provide: AngularFireAuth.Auth, useValue: {} },
        { provide: SessionService, useValue: sessionSvcMock },
      ],
    }).overrideComponent(AppShellComponent, {
      remove: { imports: [ FirebaseAppModule] },
    }).compileComponents();

    fixture = TestBed.createComponent(AppShellComponent);
    fixture.detectChanges();
    harness = await RouterTestingHarness.create();
  });

  it('creates the shell component', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('contains a router-outlet', () => {
    const outlet = fixture.debugElement.query(By.directive(RouterOutlet));
    expect(outlet).toBeTruthy();
  });

  it('navigates to each route and renders the correct page in the outlet', async () => {
 
    let page = await harness.navigateByUrl('app/home', AppShellComponent);
    expect(harness.routeNativeElement?.textContent).toContain('What do you want to do today?');

    page = await harness.navigateByUrl('/app/sessions', AppShellComponent);
    expect(harness.routeNativeElement?.textContent).toContain('Session');
    
    page = await harness.navigateByUrl('/app/songs', AppShellComponent);
    expect(harness.routeNativeElement?.textContent).toContain('Songs');

    page = await harness.navigateByUrl('/app/metrics', AppShellComponent);
    expect(harness.routeNativeElement?.textContent).toContain('Metrics');
  });

  //TODO - fix this test


  it('calls signOut and navigates to root on sign-out', async () => {
    const router = TestBed.inject(Router);
    const navigateSpy = jest.spyOn(router, 'navigate').mockResolvedValue(true as any);
  
    const auth = TestBed.inject(Auth);
  
    // configure the mock for this test
    (signOut as unknown as jest.Mock).mockResolvedValue(undefined);
  
    const cmp = fixture.componentInstance;
    await cmp.onSignOut();
  
    expect(signOut).toHaveBeenCalledWith(auth);
    expect(navigateSpy).toHaveBeenCalledWith(['/']);
  });
  
  

});