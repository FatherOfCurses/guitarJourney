import { TestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component } from '@angular/core';
import {
  Routes,
  Router,
  RouterLink,
  RouterOutlet,
  provideRouter,
} from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { FirebaseApp } from '@angular/fire/app';
import { AuthModule, Auth } from '@angular/fire/auth';
import { FirebaseAppModule } from '@angular/fire/app';
import { AppShellComponent } from './app-shell.component';
import { signOut } from '@angular/fire/auth';

/** ---- STUB PAGES (standalone) ---- */
@Component({ standalone: true, template: 'home' })     class HomeStubComponent {}
@Component({ standalone: true, template: 'sessions' }) class SessionsStubComponent {}
@Component({ standalone: true, template: 'songs' })    class SongsStubComponent {}
@Component({ standalone: true, template: 'metrics' })  class MetricsStubComponent {}

const routes: Routes = [
  { path: '', component: HomeStubComponent },
  { path: 'sessions', component: SessionsStubComponent },
  { path: 'songs',    component: SongsStubComponent },
  { path: 'metrics',  component: MetricsStubComponent },
];

describe('AppShellComponent', () => {
  let fixture: ComponentFixture<AppShellComponent>;
  let router: Router;
  let harness: RouterTestingHarness;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        // Import the standalone shell directly
        AppShellComponent,
      ],
      providers: [
        // Modern router testing setup
        provideRouter([]),
        { provide: FirebaseApp, useValue: {} },
        { provide: Auth, useValue: {} },
      ],
    }).overrideComponent(AppShellComponent, {
      remove: { imports: [AuthModule, FirebaseAppModule] },
    }).compileComponents();

    router = TestBed.inject(Router);
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
   const router = TestBed.inject(Router);
   await router.navigateByUrl('/');
   fixture.detectChanges();
   
   
   
    // let page = await harness.navigateByUrl('/', HomeStubComponent);
   // expect(page).toBeTruthy;
   // expect(page).toBeInstanceOf(HomeStubComponent);

    let page = await harness.navigateByUrl('/sessions', SessionsStubComponent);
    expect(page).toBeInstanceOf(SessionsStubComponent);

    page = await harness.navigateByUrl('/songs', SongsStubComponent);
    expect(page).toBeInstanceOf(SongsStubComponent);

    page = await harness.navigateByUrl('/metrics', MetricsStubComponent);
    expect(page).toBeInstanceOf(MetricsStubComponent);
  });

  it('applies the routerLinkActive class to the matching link after navigation', async () => {
    await harness.navigateByUrl('/songs', SongsStubComponent);
    fixture.detectChanges();

    const songLinkDe = fixture.debugElement
      .queryAll(By.css('a[routerLink]'))
      .find(de => (de.nativeElement as HTMLElement).textContent?.trim() === 'Songs');

    expect(songLinkDe).toBeTruthy();
    const el = songLinkDe!.nativeElement as HTMLElement;
    expect(el.classList.contains('text-indigo-600')).toBe(true);
  });

  it('calls signOut and navigates to root on sign-out', async () => {
    const router = TestBed.inject(Router);
    const navigateSpy = jest.spyOn(router, 'navigate').mockResolvedValue(true as any);

    const signOutMock = signOut as unknown as jest.Mock;

    // Create the component and call the method directly
    const cmp = fixture.componentInstance;
    await cmp.onSignOut();

    expect(signOutMock).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['/']);
  });

});