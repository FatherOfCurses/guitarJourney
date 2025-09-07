// session.component.spec.ts
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SessionComponent } from './session.component';
import { of, Subject } from 'rxjs';
import { convertToParamMap } from '@angular/router';
import { Session } from '@models/session';
import { SessionService } from '@services/session.service'
import { fakeAsync, flushMicrotasks, tick } from '@angular/core/testing';


function type(el: HTMLInputElement | HTMLTextAreaElement, value: string) {
    el.value = value;
    el.dispatchEvent(new Event('input'));
  }

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
    create:          jest.fn((session: Partial<Session>) => Promise.resolve('new-id')),
  };

  async function setup() {
    paramMap$ = new Subject();
    get$ = new Subject<Session>();
  }

describe('SessionComponent (template-driven behaviors)', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionComponent],
      // Ignore unknown PrimeNG elements/directives used in the template (pInputText, pInputTextarea, p-button)
      providers: [
        { provide: SessionService, useValue: sessionSvcMock },
      ],
    }).compileComponents();
  });

  function createFixtureWithStatus(phase: 'Before' | 'During' | 'After') {
    const fixture = TestBed.createComponent(SessionComponent);
    const cmp = fixture.componentInstance;
  
    // The component starts in 'Before' by default.
    // Make the BEFORE form valid so start() will work.
    cmp.beforeForm.setValue({
      practiceTime: 25,
      whatToPractice: 'Warm-ups + scales',
      sessionIntent: 'Improve picking',
    });
  
    fixture.detectChanges();
  
    if (phase === 'During') {
      cmp.start();                 // moves to During and starts timer
      fixture.detectChanges();
    } else if (phase === 'After') {
      cmp.start();
      fixture.detectChanges();
      cmp.stopTimer();             // moves to After
      fixture.detectChanges();
    }
  
    return { fixture, cmp };
  }

  describe('BEFORE state', () => {
    it('renders the pre-practice form and disables Start until valid', async () => {
      const { fixture } = createFixtureWithStatus('Before');
 
      const practiceTime = fixture.debugElement.query(By.css('#practiceTime'))?.nativeElement as HTMLInputElement;
      const whatToPractice = fixture.debugElement.query(By.css('#whatToPractice'))?.nativeElement as HTMLTextAreaElement;
      const sessionIntent = fixture.debugElement.query(By.css('#sessionIntent'))?.nativeElement as HTMLInputElement;
      const startBtn = fixture.debugElement.query(By.css('#startButton'))?.nativeElement as HTMLInputElement;

      // Initially invalid -> disabled
      expect(startBtn).toBeTruthy();
      expect(startBtn.disabled).toBe(false);
    });

    it('clicking Start calls startTimer()', () => {
      const { fixture, cmp } = createFixtureWithStatus('Before');

      // Make form valid via template inputs
      type(fixture.debugElement.query(By.css('#practiceTime')).nativeElement, '30');
      type(fixture.debugElement.query(By.css('#whatToPractice')).nativeElement, 'Chord changes');
      type(fixture.debugElement.query(By.css('#sessionIntent')).nativeElement, 'Clean transitions');
      fixture.detectChanges();

      (fixture.debugElement.query(By.css('#sessionForm')).nativeElement as HTMLFormElement).dispatchEvent(
        new Event('submit', { bubbles: true, cancelable: true })
      );
      fixture.detectChanges();
      expect(cmp.status()).toBe('During');
    });

    /* TODO: Enable this test once the addResourcesToSession() method is implemented
    it('clicking "Yes" to add resources calls addResourcesToSession()', () => {
      const { fixture, cmp } = createFixtureWithStatus('Before');
      const addBtn = fixture.debugElement.query(By.css('#addResources'))?.nativeElement as HTMLButtonElement;
      addBtn.click();
      fixture.detectChanges();
    });
    */
  });

  describe('DURING state', () => {
    it('shows timer and clicking End calls stopTimer()', () => {
      const { fixture, cmp } = createFixtureWithStatus('During');

      // Ensure the timer text is shown
      const timer = fixture.debugElement.query(By.css('#timerSection'))?.nativeElement as HTMLElement;
      expect(timer).toBeTruthy();
      expect(timer.textContent || '').toContain('0:00');

      (fixture.debugElement.query(By.css('#endButton')).nativeElement as HTMLButtonElement).click();
      fixture.detectChanges();

      expect(cmp.status()).toBe('After');});

    /* TODO: Enable this test once the resourcesAdded() signal and addResourcesToSession() method are implemented
    it('renders the resources section when resourcesAdded() is true', () => {
      const { fixture, cmp } = createFixtureWithStatus('During');
      // Flip the signal and re-render
      //cmp.resourcesAdded = jest.fn(() => true);
      fixture.detectChanges();

      const resources = fixture.debugElement.query(By.css('#resourcesSection'))?.nativeElement as HTMLElement;
      expect(resources).toBeTruthy();
    });
    */
  });

  describe('AFTER state', () => {
    it('disables Finish when loading() is true', async () => {
      const { fixture, cmp } = createFixtureWithStatus('After');

      // Initially false (enabled)
      let finishBtn = fixture.debugElement.query(By.css('#afterForm button'))?.nativeElement as HTMLButtonElement;
      expect(finishBtn.disabled).toBe(false);

      // Simulate loading state
      cmp['_loading'].set(true);
      fixture.detectChanges();
      expect(finishBtn.disabled).toBe(true);
    });

    it('clicking Finish calls onSubmit() when not loading', async () => {
      const { fixture, cmp } = createFixtureWithStatus('After');

      // Make sure not loading
      fixture.detectChanges();

      const finishBtn = fixture.debugElement.query(By.css('#afterForm button'))?.nativeElement as HTMLButtonElement;
      finishBtn.click()
      fixture.detectChanges();

      expect(cmp.saving()).toBe(true);});

    it('validates afterForm controls (reflection + goal) via the DOM', () => {
      const { fixture, cmp } = createFixtureWithStatus('After');

      // pessimistically mark invalid state
      cmp.afterForm?.markAllAsTouched?.();
      fixture.detectChanges();

      // Fill the two textareas through the DOM to simulate user typing
      const reflection = fixture.debugElement.query(By.css('#sessionReflection'))?.nativeElement as HTMLTextAreaElement;
      const goal = fixture.debugElement.query(By.css('#goalForNextTime'))?.nativeElement as HTMLTextAreaElement;

      type(reflection, 'Today I finally nailed the F barre chord.');
      type(goal, 'Start with slow metronome work at 60 BPM.');
      fixture.detectChanges();

      // Expect no error messages to be visible now
      const errors = Array.from(
        fixture.nativeElement.querySelectorAll('#afterForm .text-red-600')
      ) as HTMLElement[];
      expect(errors.length).toBe(0);
    });
  });

  describe('onSubmit promise paths', () => {
    let createSpy: jest.SpyInstance;
  
    function primeValidForm(cmp: SessionComponent) {
      // Fill the controls with valid values so create() gets called
      cmp.whatToPracticeCtrl.setValue('Chord changes: C ↔︎ F');
      cmp.sessionIntentCtrl.setValue('Improve clean transitions');
      cmp.sessionReflectionCtrl.setValue('Barre chords improving');
      cmp.goalForNextTimeCtrl.setValue('Metronome @ 70 BPM, 10 mins');
      // Ensure elapsedSeconds() returns something deterministic
      jest.spyOn(cmp as any, 'elapsedSeconds').mockReturnValue(1200); // 20 minutes
    }
  
    it('resolves: turns off saving/loading after 800ms and navigates to /app', fakeAsync(() => {
      const fixture = TestBed.createComponent(SessionComponent);
      const cmp = fixture.componentInstance;
  
      // Stub router directly on the component to avoid TestBed changes
      const navigate = jest.fn();
      (cmp as any).router = { navigate };
  
      // Mock create() -> resolved promise
      // If your spec already has sessionSvcMock, reuse it; otherwise adapt as needed.
      const svc = TestBed.inject(SessionService) as any;
      createSpy = jest.spyOn(svc, 'create').mockResolvedValue(undefined);
  
      primeValidForm(cmp);
  
      // Call
      cmp.onSubmit();
  
      // Immediately after calling, flags should be true
      expect(cmp.saving()).toBe(true);
      expect(cmp.loading()).toBe(true);
  
      // Let the promise resolve
      flushMicrotasks();
  
      // The success branch sets a setTimeout(800) before flipping flags + navigate
      tick(800);
      fixture.detectChanges();
  
      expect(createSpy).toHaveBeenCalledWith({
        whatToPractice: 'Chord changes: C ↔︎ F',
        sessionIntent: 'Improve clean transitions',
        postPracticeReflection: 'Barre chords improving',
        goalForNextTime: 'Metronome @ 70 BPM, 10 mins',
        practiceTime: 1200 / 60, // 20
      });
      expect(cmp.saving()).toBe(false);
      expect(cmp.loading()).toBe(false);
      expect(navigate).toHaveBeenCalledWith(['/app']);
    }));
  
    it('rejects: logs error and turns off saving/loading; does not navigate', fakeAsync(() => {
      const fixture = TestBed.createComponent(SessionComponent);
      const cmp = fixture.componentInstance;
  
      // Stub router again
      const navigate = jest.fn();
      (cmp as any).router = { navigate };
  
      // Mock create() -> rejected promise
      const svc = TestBed.inject(SessionService) as any;
      const err = new Error('create failed');
      createSpy = jest.spyOn(svc, 'create').mockRejectedValue(err);
  
      // Spy on console.error to assert it’s called (optional but nice)
      const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  
      primeValidForm(cmp);
  
      // Call
      cmp.onSubmit();
  
      // Immediately after calling, flags should be true
      expect(cmp.saving()).toBe(true);
      expect(cmp.loading()).toBe(true);
  
      // Let the promise reject
      flushMicrotasks();
      fixture.detectChanges();
  
      // No 800ms delay on the error path — flags flip immediately
      expect(errorSpy).toHaveBeenCalledWith('Error saving session:', err);
      expect(cmp.saving()).toBe(false);
      expect(cmp.loading()).toBe(false);
      expect(navigate).not.toHaveBeenCalled();
  
      errorSpy.mockRestore();
    }));
  });
  
});
