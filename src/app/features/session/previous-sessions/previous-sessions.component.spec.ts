import { TestBed } from '@angular/core/testing';
import { of, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { SessionService } from '@services/session.service';

import { PreviousSessionsComponent } from './previous-sessions.component';

// Minimal Session shape for the test (avoid importing app models)
type Session = { id: string; [k: string]: any };

describe('PreviousSessionsComponent', () => {
  let fixture: any;
  let cmp: PreviousSessionsComponent;

  const sessionServiceMock = {
    list$: jest.fn(),
    get$: jest.fn(),
  };

  const routerMock = {
    navigate: jest.fn<Promise<boolean>, any[]>().mockResolvedValue(true),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    TestBed.configureTestingModule({
      imports: [PreviousSessionsComponent], // standalone component
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: (class {} as any), useValue: null }, // no-op, placeholder if needed
        { provide: SessionService, useValue: sessionServiceMock },
      ],
    });

    // Avoid loading PrimeNG template/deps in unit tests
    TestBed.overrideComponent(PreviousSessionsComponent, {
      set: {
        template: '',
        // (Optional) If you want to avoid PrimeNG entirely in tests:
        // imports: [],
      },
    });

    fixture = TestBed.createComponent(PreviousSessionsComponent);
    cmp = fixture.componentInstance;
  });

  it('creates', () => {
    expect(cmp).toBeTruthy();
  });

  it('ngOnInit subscribes to list$ and populates sessionData', () => {
    const subject = new Subject<Session[]>();
    sessionServiceMock.list$.mockReturnValue(subject.asObservable());

    // trigger ngOnInit
    fixture.detectChanges();

    expect(sessionServiceMock.list$).toHaveBeenCalledTimes(1);
    expect(cmp.sessionData).toBeUndefined();

    const data: Session[] = [
      { id: 'a1', whatToPractice: 'Scales' },
      { id: 'b2', whatToPractice: 'Chords' },
    ];
    subject.next(data);

    expect(cmp.sessionData).toEqual(data);
  });

  it('retrieveSessionById delegates to sessionService.get$', () => {
    const sess: Session = { id: 'xyz', whatToPractice: 'Arpeggios' };
    const obs$ = of(sess);
    sessionServiceMock.get$.mockReturnValue(obs$);

    const result$ = cmp.retrieveSessionById('xyz');

    expect(sessionServiceMock.get$).toHaveBeenCalledWith('xyz');
    expect(result$).toBe(obs$);
  });

  it('onRowSelect navigates to /app/sessionDetail/:id', async () => {
    const event = { data: { id: 'abc123' } };
    await cmp.onRowSelect(event);

    expect(routerMock.navigate).toHaveBeenCalledWith(['/app', 'sessionDetail', 'abc123']);
  });
});
