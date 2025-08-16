import { TestBed, ComponentFixture, flush } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { Subject, throwError, of } from 'rxjs';
import { By } from '@angular/platform-browser';

import { DisplaySessionComponent } from './display-session.component';
import { SessionService } from '../../../services/session.service';
import type { Session } from '../../../models/session';

describe('DisplaySessionComponent (standalone)', () => {
  let fixture: ComponentFixture<DisplaySessionComponent>;
  let component: DisplaySessionComponent;
  let router: Router;
  

  // Route param stream we control per test
  let paramMap$: Subject<ReturnType<typeof convertToParamMap>>;

  // Mock service with a configurable implementation
  let sessionSvcMock: { getSession$: jest.Mock };

  const makeModule = async () => {
    paramMap$ = new Subject();

    sessionSvcMock = {
      getSession$: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [DisplaySessionComponent],             // standalone import
      providers: [
        provideRouter([]),                            // modern router provider
        { provide: ActivatedRoute, useValue: { paramMap: paramMap$.asObservable() } },
        { provide: SessionService, useValue: sessionSvcMock },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(DisplaySessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // initial CD
  };

  it('creates', async () => {
    await makeModule();
    expect(component).toBeTruthy();
  });

  it('loads a session when an id param appears (happy path), toggling loading/hasError', async () => {
    await makeModule();

    // Arrange service to return a value synchronously for the requested id
    const mockSession: Session = { id: 'abc123' } as Session;
    sessionSvcMock.getSession$.mockImplementation((id: string) => of(mockSession));

    // Emit the route param
    paramMap$.next(convertToParamMap({ id: 'abc123' }));
    fixture.detectChanges(); // trigger CD after param change


    // Signals should reflect loaded state
    expect(component.sessionId()).toBe('abc123');
    expect(component.session()).toEqual(mockSession);
    expect(component.loading()).toBe(false);
    expect(component.hasError()).toBe(false);

    // Template should NOT show loading/error text
    const pTags = fixture.debugElement.queryAll(By.css('p'));
    const texts = fixture.debugElement
    .queryAll(By.css('p'))
    .map(p => (p.nativeElement as HTMLElement).textContent?.trim());
    expect(texts).not.toContain('Loading…');
    expect(texts).not.toContain('Could not load the session.');
  });

  it('shows loading… until the service emits, then shows loaded state', async () => {
    await makeModule();

    // Make the service return a subject so we control timing
    const sessionSubject = new Subject<Session | null>();
    sessionSvcMock.getSession$.mockReturnValue(sessionSubject.asObservable());

    // Emit id -> should enter loading state
    paramMap$.next(convertToParamMap({ id: 'late' }));
    fixture.detectChanges();

    expect(component.loading()).toBe(true);
    const loadingP = fixture.debugElement.queryAll(By.css('p')).find(p =>
      (p.nativeElement as HTMLElement).textContent?.includes('Loading…')
    );
    expect(loadingP).toBeTruthy();

    // Now emit the session -> loading turns false
    const mock: Session = { id: 'late' } as Session;
    sessionSubject.next(mock);
    sessionSubject.complete();
    fixture.detectChanges();

    expect(component.session()).toEqual(mock);
    expect(component.loading()).toBe(false);
    expect(component.hasError()).toBe(false);

    // Loading text disappears
    const after = fixture.debugElement.queryAll(By.css('p')).map(p =>
      (p.nativeElement as HTMLElement).textContent?.trim()
    );
    expect(after).not.toContain('Loading…');
  });

  it('sets hasError when the service errors and shows the error message', async () => {
    await makeModule();

    sessionSvcMock.getSession$.mockImplementation(() =>
      throwError(() => new Error('boom'))
    );

    paramMap$.next(convertToParamMap({ id: 'bad' }));
    fixture.detectChanges();

    expect(component.sessionId()).toBe('bad');
    expect(component.session()).toBeNull();  // catchError → null
    expect(component.loading()).toBe(false);
    expect(component.hasError()).toBe(true);

    const errorP = fixture.debugElement.queryAll(By.css('p')).find(p =>
      (p.nativeElement as HTMLElement).textContent?.includes('Could not load the session.')
    );
    expect(errorP).toBeTruthy();
  });

  it('navigates back to /sessions when the Back button is clicked', async () => {
    await makeModule();

    const navSpy = jest.spyOn(router, 'navigate').mockResolvedValue(true as any);

    // Button is always rendered at the bottom of the template
    const btn = fixture.debugElement.query(By.css('button'));
    expect(btn).toBeTruthy();

    (btn.nativeElement as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(navSpy).toHaveBeenCalledWith(['/sessions']);
  });
});
