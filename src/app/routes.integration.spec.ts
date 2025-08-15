import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { Routes, Route } from '@angular/router';
import { Router } from '@angular/router';
import { RouterTestingModule, RouterTestingHarness } from '@angular/router/testing';

import { routes as realRoutes } from './routes';
import { AppShellComponent } from './app-shell.component';

/**
 * --- STUB COMPONENTS ---
 * Each is standalone to mirror lazy-loaded components cleanly.
 */
@Component({
  standalone: true,
  selector: 'app-shell-stub',
  template: `<router-outlet></router-outlet>`,
})
class AppShellStubComponent {}

@Component({ standalone: true, selector: 'app-login-stub',  template: 'login' })  class LoginStubComponent {}
@Component({ standalone: true, selector: 'app-home-stub',   template: 'home' })   class HomeStubComponent {}
@Component({ standalone: true, selector: 'app-sessions-stub', template: 'sessions' }) class SessionsStubComponent {}
@Component({ standalone: true, selector: 'app-songs-stub',  template: 'songs' })  class SongsStubComponent {}
@Component({ standalone: true, selector: 'app-metrics-stub', template: 'metrics' }) class MetricsStubComponent {}
@Component({ standalone: true, selector: 'app-404-stub',    template: 'not-found' }) class NotFoundStubComponent {}

/**
 * Clone the real routes and replace:
 *  - component: AppShellComponent -> AppShellStubComponent
 *  - loadComponent: return our stub components via Promise.resolve
 */
function stubbedRoutes(): Routes {
  const deepClone = <T>(obj: T): T => JSON.parse(JSON.stringify(obj));
  const cloned: Routes = deepClone(realRoutes);

  const mapLoad = (r: Route): Route => {
    const copy: Route = { ...r };

    // Replace shell component
    if (copy.component === AppShellComponent) {
      copy.component = AppShellStubComponent;
    }

    // Replace lazy-loaded components with stubs
    if (typeof copy.loadComponent === 'function') {
      if (copy.path === 'login') {
        copy.loadComponent = () => Promise.resolve(LoginStubComponent);
      } else if (copy.path === '**') {
        copy.loadComponent = () => Promise.resolve(NotFoundStubComponent);
      } else if (copy.path === '') {
        // could be home under children
        copy.loadComponent = () => Promise.resolve(HomeStubComponent);
      } else if (copy.path === 'sessions') {
        copy.loadComponent = () => Promise.resolve(SessionsStubComponent);
      } else if (copy.path === 'songs') {
        copy.loadComponent = () => Promise.resolve(SongsStubComponent);
      } else if (copy.path === 'metrics') {
        copy.loadComponent = () => Promise.resolve(MetricsStubComponent);
      }
    }

    if (Array.isArray(copy.children)) {
      copy.children = copy.children.map(mapLoad);
    }
    return copy;
  };

  return cloned.map(mapLoad);
}

describe('App Routes (integration)', () => {
  let router: Router;
  let harness: RouterTestingHarness;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        // Use our stubbed route tree
        RouterTestingModule.withRoutes(stubbedRoutes()),
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    harness = await RouterTestingHarness.create(router);
  });

  it('navigates to /login and renders the login stub', async () => {
    const fixture = await harness.navigateByUrl('/login', LoginStubComponent);
    expect(fixture.instance).toBeInstanceOf(LoginStubComponent);
  });

  it('navigates to / (home) and renders the home stub within the shell', async () => {
    const fixture = await harness.navigateByUrl('/', HomeStubComponent);
    expect(fixture.instance).toBeInstanceOf(HomeStubComponent);
  });

  it('navigates to /sessions and renders the sessions stub', async () => {
    const fixture = await harness.navigateByUrl('/sessions', SessionsStubComponent);
    expect(fixture.instance).toBeInstanceOf(SessionsStubComponent);
  });

  it('navigates to /songs and renders the songs stub', async () => {
    const fixture = await harness.navigateByUrl('/songs', SongsStubComponent);
    expect(fixture.instance).toBeInstanceOf(SongsStubComponent);
  });

  it('navigates to /metrics and renders the metrics stub', async () => {
    const fixture = await harness.navigateByUrl('/metrics', MetricsStubComponent);
    expect(fixture.instance).toBeInstanceOf(MetricsStubComponent);
  });

  it('falls back to 404 for unknown routes', async () => {
    const fixture = await harness.navigateByUrl('/definitely-not-a-real-route', NotFoundStubComponent);
    expect(fixture.instance).toBeInstanceOf(NotFoundStubComponent);
  });

  it('updates the URL after navigation', async () => {
    await harness.navigateByUrl('/songs', SongsStubComponent);
    expect(router.url).toBe('/songs');
  });
});
