import { TestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component } from '@angular/core';
import {
  Routes,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';
import {
  RouterTestingModule,
  RouterTestingHarness,
} from '@angular/router/testing';

import { AppShellComponent } from './app-shell.component';

/** ---- STUB PAGES (standalone) ---- */
@Component({ standalone: true, template: 'home' })   class HomeStubComponent {}
@Component({ standalone: true, template: 'sessions' }) class SessionsStubComponent {}
@Component({ standalone: true, template: 'songs' })  class SongsStubComponent {}
@Component({ standalone: true, template: 'metrics' }) class MetricsStubComponent {}

const routes: Routes = [
  { path: '', pathMatch: 'full', loadComponent: () => Promise.resolve(HomeStubComponent) },
  { path: 'sessions', loadComponent: () => Promise.resolve(SessionsStubComponent) },
  { path: 'songs',    loadComponent: () => Promise.resolve(SongsStubComponent) },
  { path: 'metrics',  loadComponent: () => Promise.resolve(MetricsStubComponent) },
];

describe('AppShellComponent', () => {
  let fixture: ComponentFixture<AppShellComponent>;
  let router: Router;
  let harness: RouterTestingHarness;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        // Import the standalone component directly and wire test routes
        AppShellComponent,
        RouterTestingModule.withRoutes(routes),
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(AppShellComponent);
    fixture.detectChanges();

    harness = await RouterTestingHarness.create(router);
  });

  it('creates the shell component', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('contains a router-outlet', () => {
    const outlet = fixture.debugElement.query(By.directive(RouterOutlet));
    expect(outlet).toBeTruthy();
  });

  it('renders expected nav links with correct routerLink commands', () => {
    // Grab all elements that have the RouterLink directive
    const linkDes = fixture.debugElement.queryAll(By.directive(RouterLink));
    const commands = linkDes.map(de => (de.injector.get(RouterLink) as RouterLink).commands);

    // commands is an array of link params; normalize to route strings
    const paths = commands.map(c => (Array.isArray(c) ? c.join('/') : String(c)));

    // Expect the four links in the header
    expect(paths).toEqual(['/', '/sessions', '/songs', '/metrics']);

    // (Optional) verify visible text is present
    const textContent = linkDes.map(de => (de.nativeElement as HTMLElement).textContent?.trim());
    expect(textContent).toEqual([
      'Guitar Journey',
      'Sessions',
      'Songs',
      'Metrics',
    ]);
  });

  it('navigates to each route and renders the correct page in the outlet', async () => {
    let page = await harness.navigateByUrl('/', HomeStubComponent);
    expect(page.instance).toBeInstanceOf(HomeStubComponent);

    page = await harness.navigateByUrl('/sessions', SessionsStubComponent);
    expect(page.instance).toBeInstanceOf(SessionsStubComponent);

    page = await harness.navigateByUrl('/songs', SongsStubComponent);
    expect(page.instance).toBeInstanceOf(SongsStubComponent);

    page = await harness.navigateByUrl('/metrics', MetricsStubComponent);
    expect(page.instance).toBeInstanceOf(MetricsStubComponent);
  });

  it('applies the routerLinkActive class to the matching link after navigation', async () => {
    // Navigate to /songs
    await harness.navigateByUrl('/songs', SongsStubComponent);

    // Trigger change detection on the shell so classes update
    fixture.detectChanges();

    // Find the <a> with text "Songs"
    const songLinkDe = fixture.debugElement
      .queryAll(By.css('a[routerLink]'))
      .find(de => (de.nativeElement as HTMLElement).textContent?.trim() === 'Songs');

    expect(songLinkDe).toBeTruthy();
    const el = songLinkDe!.nativeElement as HTMLElement;
    // Your template sets routerLinkActive="text-indigo-600"
    expect(el.classList.contains('text-indigo-600')).toBe(true);
  });
});
