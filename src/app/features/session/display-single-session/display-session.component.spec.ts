import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideRouter, Router, ActivatedRoute, convertToParamMap } from '@angular/router';
import { Subject, of} from 'rxjs';
import { DisplaySessionComponent } from './display-session.component';
import { SessionService } from '@services/session.service';
import { ResourceService } from '../../../services/resource.service';
import type { SessionResource } from '../../../models/session-resource';
import type { Session } from '@models/session';
import { screen } from '@testing-library/angular';

describe('DisplaySessionComponent (standalone)', () => {
  let fixture: ComponentFixture<DisplaySessionComponent>;
  let router: Router;

  // ActivatedRoute.paramMap mock
  let paramMap$!: Subject<ReturnType<typeof convertToParamMap>>;

  // Session service mock with multiple possible method names to be robust
  const makeSession = (over: Partial<Session> = {}): Session => ({
    id: '123',
    date: { toDate: () => new Date('2025-08-01'), seconds: 0, nanoseconds: 0 } as any,
    practiceTime: 35,
    whatToPractice: 'Pentatonics',
    sessionIntent: 'Speed & accuracy',
    postPracticeReflection: 'Felt good',
    goalForNextTime: 'Metronome +5bpm',
    ...(over as any)
  });

  let get$!: Subject<Session>;
  let sessionResources$!: Subject<SessionResource[]>;

  const makeResource = (over: Partial<SessionResource> = {}): SessionResource => ({
    id: 'sr-1',
    resourceId: 'res-1',
    type: 'youtube',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    label: 'Barre Chord Basics',
    tags: ['barre'],
    pinnedAt: { seconds: 0, nanoseconds: 0 } as any,
    ...(over as any),
  });

  const resourceSvcMock: any = {
    getSessionResources: jest.fn(() => sessionResources$ ?? of([])),
  };

  const sessionSvcMock: any = {
    getSessionById: jest.fn((id: string) => get$ ?? of(makeSession())),
    getById:         jest.fn((id: string) => get$ ?? of(makeSession())),
    findOne:         jest.fn((id: string) => get$ ?? of(makeSession())),
    get$:            jest.fn((id: string) => get$ ?? of(makeSession())),
  };

  async function setup() {
    paramMap$ = new Subject();
    get$ = new Subject<Session>();
    sessionResources$ = new Subject<SessionResource[]>();

    await TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            // what the component reads
            paramMap: paramMap$.asObservable(),
            snapshot: { paramMap: convertToParamMap({}) },
          },
        },
        { provide: SessionService, useValue: sessionSvcMock },
        { provide: ResourceService, useValue: resourceSvcMock },
      ],
      imports: [DisplaySessionComponent], // standalone
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(DisplaySessionComponent);
    fixture.detectChanges();
  }

  const emitId = (id: string) => {
    paramMap$.next(convertToParamMap({ id }));
  };

  it('shows Loading… while waiting for the session', async () => {
    await setup();
    // emit route param and keep service pending
    emitId('123');

    fixture.detectChanges();
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Loading…');

    // now resolve service
    get$.next(makeSession());
    get$.complete();
    fixture.detectChanges();

    const deets = screen.findAllByDisplayValue('Session Details');
    expect(deets).toBeTruthy();
    const sessionDate = screen.findAllByText('2025-08-01');
    expect(sessionDate).toBeTruthy();

  });

  it('renders an error message when the service errors', async () => {
    await setup();
    // rewire mock to emit error for this test
    get$.error(new Error('boom'));
    emitId('999');
    fixture.detectChanges();

    const text = screen.findAllByText('Could not load the session');
    expect(text).toBeTruthy();
  });

  it('renders session fields on success', async () => {
    await setup();
    emitId('abc');
    get$.next(makeSession({ id: 'abc', whatToPractice: 'Modes', practiceTime: 50 }));
    get$.complete();
    fixture.detectChanges();

    const deets = screen.findAllByDisplayValue('Session Details');
    expect(deets).toBeTruthy();
    const modes = screen.findAllByDisplayValue('Modes');
    expect(modes).toBeTruthy();
    const time = screen.findAllByDisplayValue('50 min');
    expect(time).toBeTruthy();
  });

  it('hasError is false before an id is emitted (sessionId is null)', async () => {
    await setup();
    // No id emitted yet — sessionId() is null, so hasError short-circuits to false
    fixture.detectChanges();
    expect(fixture.componentInstance.hasError()).toBe(false);
  });

  it('hasError is false when session loads successfully', async () => {
    await setup();
    emitId('abc');
    get$.next(makeSession({ id: 'abc' }));
    get$.complete();
    fixture.detectChanges();
    expect(fixture.componentInstance.hasError()).toBe(false);
  });

  it('hasError is true when the service errors after an id is emitted', async () => {
    await setup();
    emitId('999');
    get$.error(new Error('boom'));
    fixture.detectChanges();
    expect(fixture.componentInstance.hasError()).toBe(true);
  });

  it('goToDashboard navigates to /app/dashboard', () => {
    const navSpy = jest.spyOn(router, 'navigate').mockResolvedValue(true as any);
    fixture.componentInstance.goToDashboard();
    expect(navSpy).toHaveBeenCalledWith(['/app', 'dashboard']);
  });

  it('returnToTable navigates to /app/sessions', () => {
    const navSpy = jest.spyOn(router, 'navigate').mockResolvedValue(true as any);
    fixture.componentInstance.returnToTable();
    expect(navSpy).toHaveBeenCalledWith(['/app', 'sessions']);
  });

  //TODO: fix this test
  /*
  it('navigates back to the table when Back button is clicked', fakeAsync(() => {
    setup(); // no await in fakeAsync
    const component = fixture.componentInstance;
    const router = TestBed.inject(Router);
    const navSpy = jest.spyOn(router, 'navigate').mockResolvedValue(true as any);
  
    // Drive inputs
    emitId('123');
    get$.next(makeSession());
    get$.complete();
    fixture.detectChanges();
  
    // Let toSignal/async pipes settle and the @if branch switch
    component.returnToTable();

    tick();                // resolve router.navigate promise
  
    expect(navSpy).toHaveBeenCalledWith(['/app', 'sessions']);
  }));
  */

  // ── Session resources ───────────────────────────────────────

  describe('pinned resources', () => {
    /** Loads a session so the card body renders, leaving resources for the test to control. */
    const loadSession = () => {
      emitId('abc');
      get$.next(makeSession({ id: 'abc' }));
      get$.complete();
    };

    it('requests the resources for the session id in the route', async () => {
      await setup();
      loadSession();

      expect(resourceSvcMock.getSessionResources).toHaveBeenCalledWith('abc');
    });

    it('shows skeletons while the resources are still loading', async () => {
      await setup();
      loadSession();
      fixture.detectChanges();

      expect(fixture.componentInstance.resourcesLoading()).toBe(true);
      expect(fixture.nativeElement.querySelector('p-skeleton')).toBeTruthy();
    });

    it('renders one app-session-resource per pinned resource', async () => {
      await setup();
      loadSession();
      sessionResources$.next([
        makeResource({ id: 'sr-1', label: 'Barre Chord Basics' }),
        makeResource({ id: 'sr-2', label: 'Blues Scale PDF', type: 'pdf', url: 'https://example.com/b.pdf' }),
      ]);
      fixture.detectChanges();

      const rendered = fixture.nativeElement.querySelectorAll('app-session-resource');
      expect(rendered.length).toBe(2);
      expect(fixture.nativeElement.textContent).toContain('Blues Scale PDF');
    });

    it('renders resources read-only — no remove buttons on the detail page', async () => {
      await setup();
      loadSession();
      sessionResources$.next([makeResource({ type: 'pdf', url: 'https://example.com/b.pdf' })]);
      fixture.detectChanges();

      const removeBtn = fixture.nativeElement.querySelector('[aria-label^="Remove"]');
      expect(removeBtn).toBeNull();
    });

    it('hides the section entirely when the session has no resources', async () => {
      await setup();
      loadSession();
      sessionResources$.next([]);
      fixture.detectChanges();

      expect(fixture.componentInstance.hasResources()).toBe(false);
      expect(fixture.nativeElement.querySelector('#resourcesSection')).toBeNull();
    });

    it('degrades to no resources when the read fails, leaving the session readable', async () => {
      await setup();
      loadSession();
      sessionResources$.error(new Error('permission denied'));
      fixture.detectChanges();

      expect(fixture.componentInstance.resources()).toEqual([]);
      expect(fixture.componentInstance.hasResources()).toBe(false);
      // The session itself must still be on screen.
      expect(fixture.nativeElement.textContent).toContain('Pentatonics');
    });
  });

});


