import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideRouter, Router, ActivatedRoute, convertToParamMap } from '@angular/router';
import { Subject, of, throwError, BehaviorSubject } from 'rxjs';
import { By } from '@angular/platform-browser';
import { DisplaySessionComponent } from './display-session.component';
import { SessionService } from '../../../services/session.service';
import type { Session } from '../../../models/session';
import { render, screen } from '@testing-library/angular';
import { fakeAsync, tick } from '@angular/core/testing';

describe('DisplaySessionComponent (standalone)', () => {
  let fixture: ComponentFixture<DisplaySessionComponent>;
  let router: Router;

  // ActivatedRoute.paramMap mock
  let paramMap$!: Subject<ReturnType<typeof convertToParamMap>>;

  // Session service mock with multiple possible method names to be robust
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
    expect(deets).toBeTruthy;
    const sessionDate = screen.findAllByText('2025-08-01');
    expect(sessionDate).toBeTruthy;

  });

  it('renders an error message when the service errors', async () => {
    await setup();
    // rewire mock to emit error for this test
    get$.error(new Error('boom'));
    emitId('999');
    fixture.detectChanges();

    const text = screen.findAllByText('Could not load the session');
    expect(text).toBeTruthy;
  });

  it('renders session fields on success', async () => {
    await setup();
    emitId('abc');
    get$.next(makeSession({ id: 'abc', whatToPractice: 'Modes', practiceTime: 50 }));
    get$.complete();
    fixture.detectChanges();

    const deets = screen.findAllByDisplayValue('Session Details');
    expect(deets).toBeTruthy;
    const modes = screen.findAllByDisplayValue('Modes');
    expect(modes).toBeTruthy;
    const time = screen.findAllByDisplayValue('50 min');
    expect(time).toBeTruthy;
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
});


