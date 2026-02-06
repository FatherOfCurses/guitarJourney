import { TestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component } from '@angular/core';
import {
  Routes,
  Router,
  RouterOutlet,
  provideRouter,
} from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { Auth, signOut } from '@angular/fire/auth';
import * as AngularFireAuth from '@angular/fire/auth';
import { AppShellComponent } from './app-shell.component';

jest.mock('@angular/fire/auth', () => {
  const actual = jest.requireActual('@angular/fire/auth');
  return {
    ...actual,
    signOut: jest.fn(),
  };
});

// ─── Stub child components to avoid their dependency chains ─────
@Component({ standalone: true, template: 'Dashboard stub' })
class StubDashboard {}

@Component({ standalone: true, template: 'Session stub' })
class StubSession {}

@Component({ standalone: true, template: 'Songs stub' })
class StubSongs {}

@Component({ standalone: true, template: 'Metrics stub' })
class StubMetrics {}

const routes: Routes = [
  {
    path: 'app',
    component: AppShellComponent,
    children: [
      { path: 'home', component: StubDashboard },
      { path: 'sessions', component: StubSession },
      { path: 'songs', component: StubSongs },
      { path: 'metrics', component: StubMetrics },
    ],
  },
];

describe('AppShellComponent', () => {
  let fixture: ComponentFixture<AppShellComponent>;
  let harness: RouterTestingHarness;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppShellComponent],
      providers: [
        provideRouter(routes),
        { provide: AngularFireAuth.Auth, useValue: {} },
      ],
    })
      .overrideComponent(AppShellComponent, {
        set: {
          template: '<router-outlet></router-outlet>',
          imports: [RouterOutlet],
        },
      })
      .compileComponents();

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

  it('navigates to each route and renders the stub in the outlet', async () => {
    await harness.navigateByUrl('app/home', AppShellComponent);
    expect(harness.routeNativeElement?.textContent).toContain('Dashboard stub');

    await harness.navigateByUrl('/app/sessions', AppShellComponent);
    expect(harness.routeNativeElement?.textContent).toContain('Session stub');

    await harness.navigateByUrl('/app/songs', AppShellComponent);
    expect(harness.routeNativeElement?.textContent).toContain('Songs stub');

    await harness.navigateByUrl('/app/metrics', AppShellComponent);
    expect(harness.routeNativeElement?.textContent).toContain('Metrics stub');
  });

  it('calls signOut and navigates to root on sign-out', async () => {
    const router = TestBed.inject(Router);
    const navigateSpy = jest.spyOn(router, 'navigate').mockResolvedValue(true as any);

    const auth = TestBed.inject(Auth);

    (signOut as unknown as jest.Mock).mockResolvedValue(undefined);

    const cmp = fixture.componentInstance;
    await cmp.onSignOut();

    expect(signOut).toHaveBeenCalledWith(auth);
    expect(navigateSpy).toHaveBeenCalledWith(['/']);
  });
});
