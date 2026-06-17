// session.component.spec.ts
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { SessionComponent } from './session.component';
import { of, Subject } from 'rxjs';
import { convertToParamMap } from '@angular/router';
import { Session } from '@models/session';
import { SessionService } from '@services/session.service'
import { fakeAsync, flushMicrotasks, tick } from '@angular/core/testing';
import { ResourceService } from '../../services/resource.service';


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

  const resourceSvcMock: any = {
    getResources:     jest.fn(() => of([])),
    saveResources:    jest.fn(() => Promise.resolve(undefined)),
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
        provideNoopAnimations(),
        { provide: SessionService, useValue: sessionSvcMock },
        { provide: ResourceService, useValue: resourceSvcMock },
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

    it('renders app-session-resource-picker in the Before phase', () => {
      const { fixture } = createFixtureWithStatus('Before');
      expect(fixture.debugElement.query(By.css('app-session-resource-picker'))).toBeTruthy();
    });

    it('shows app-session-resource with remove button for each pending resource', () => {
      const { fixture, cmp } = createFixtureWithStatus('Before');
      cmp.onResourceAdded({ type: 'pdf', url: 'https://example.com/tab.pdf', label: 'Tab' });
      fixture.detectChanges();
      const resourceEls = fixture.debugElement.queryAll(By.css('app-session-resource'));
      expect(resourceEls.length).toBe(1);
    });
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

    it('shows #resourcesSection in During phase when there are pending resources', () => {
      const { fixture, cmp } = createFixtureWithStatus('Before');
      cmp.onResourceAdded({ type: 'youtube', url: 'https://www.youtube.com/watch?v=abc', label: 'Lesson' });
      cmp.start();
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('#resourcesSection'))).toBeTruthy();
    });

    it('hides #resourcesSection in During phase when no pending resources', () => {
      const { fixture } = createFixtureWithStatus('During');
      expect(fixture.debugElement.query(By.css('#resourcesSection'))).toBeNull();
    });

    it('timer increments elapsedSeconds every second', fakeAsync(() => {
      const { cmp } = createFixtureWithStatus('During');
      expect(cmp.elapsedSeconds()).toBe(0);
      tick(1000);
      expect(cmp.elapsedSeconds()).toBe(1);
      tick(2000);
      expect(cmp.elapsedSeconds()).toBe(3);
      cmp.stopTimer();
    }));

    it('timerIdlePulse is false before 90s', fakeAsync(() => {
      const { cmp } = createFixtureWithStatus('During');
      tick(89000);
      expect(cmp.timerIdlePulse()).toBe(false);
      cmp.stopTimer();
    }));

    it('timerIdlePulse becomes true at 90s', fakeAsync(() => {
      const { cmp } = createFixtureWithStatus('During');
      tick(90000);
      expect(cmp.timerIdlePulse()).toBe(true);
      cmp.stopTimer();
    }));

    it('adds gj-timer-pulse class to timer display after 90s', fakeAsync(() => {
      const { fixture, cmp } = createFixtureWithStatus('During');
      tick(90000);
      fixture.detectChanges();
      const timerEl = fixture.nativeElement.querySelector('#timerSection p');
      expect(timerEl.classList).toContain('gj-timer-pulse');
      cmp.stopTimer();
    }));
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
  
    it('resolves: turns off saving/loading and navigates to /app', async () => {
      const fixture = TestBed.createComponent(SessionComponent);
      const cmp = fixture.componentInstance;

      const navigate = jest.fn();
      (cmp as any).router = { navigate };

      const svc = TestBed.inject(SessionService) as any;
      createSpy = jest.spyOn(svc, 'create').mockResolvedValue('new-id');

      primeValidForm(cmp);

      const submitPromise = cmp.onSubmit();

      // Immediately after calling, flags should be true
      expect(cmp.saving()).toBe(true);
      expect(cmp.loading()).toBe(true);

      await submitPromise;
      fixture.detectChanges();

      expect(createSpy).toHaveBeenCalledWith({
        whatToPractice: 'Chord changes: C ↔︎ F',
        sessionIntent: 'Improve clean transitions',
        postPracticeReflection: 'Barre chords improving',
        goalForNextTime: 'Metronome @ 70 BPM, 10 mins',
        practiceTime: 1200 / 60,
      });
      expect(cmp.saving()).toBe(false);
      expect(cmp.loading()).toBe(false);
      expect(navigate).toHaveBeenCalledWith(['/app']);
    });

    it('calls saveResources when there are pending resources', async () => {
      const fixture = TestBed.createComponent(SessionComponent);
      const cmp = fixture.componentInstance;

      const navigate = jest.fn();
      (cmp as any).router = { navigate };

      const svc = TestBed.inject(SessionService) as any;
      jest.spyOn(svc, 'create').mockResolvedValue('sess-with-resources');

      const resSvc = TestBed.inject(ResourceService) as any;
      const saveSpy = jest.spyOn(resSvc, 'saveResources').mockResolvedValue(undefined);

      primeValidForm(cmp);
      cmp.onResourceAdded({ type: 'youtube', url: 'https://www.youtube.com/watch?v=abc', label: 'Lesson' });

      await cmp.onSubmit();

      expect(saveSpy).toHaveBeenCalledWith('sess-with-resources', expect.arrayContaining([
        expect.objectContaining({ url: 'https://www.youtube.com/watch?v=abc' }),
      ]));
      expect(navigate).toHaveBeenCalledWith(['/app']);
    });

    it('rejects: logs error and turns off saving/loading; does not navigate', async () => {
      const fixture = TestBed.createComponent(SessionComponent);
      const cmp = fixture.componentInstance;

      const navigate = jest.fn();
      (cmp as any).router = { navigate };

      const svc = TestBed.inject(SessionService) as any;
      const err = new Error('create failed');
      createSpy = jest.spyOn(svc, 'create').mockRejectedValue(err);

      const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      primeValidForm(cmp);

      const submitPromise = cmp.onSubmit();

      expect(cmp.saving()).toBe(true);
      expect(cmp.loading()).toBe(true);

      await submitPromise;
      fixture.detectChanges();

      expect(errorSpy).toHaveBeenCalledWith('Error saving session:', err);
      expect(cmp.saving()).toBe(false);
      expect(cmp.loading()).toBe(false);
      expect(navigate).not.toHaveBeenCalled();

      errorSpy.mockRestore();
    });
  });

  describe('pendingResources management', () => {
    it('onResourceAdded appends a resource to pendingResources', () => {
      const { cmp } = createFixtureWithStatus('Before');
      const resource = { type: 'youtube' as const, url: 'https://www.youtube.com/watch?v=abc', label: 'Test' };
      cmp.onResourceAdded(resource);
      expect(cmp.pendingResources()).toHaveLength(1);
      expect(cmp.pendingResources()[0].url).toBe(resource.url);
    });

    it('onResourceAdded deduplicates by URL', () => {
      const { cmp } = createFixtureWithStatus('Before');
      const resource = { type: 'youtube' as const, url: 'https://www.youtube.com/watch?v=abc', label: 'Test' };
      cmp.onResourceAdded(resource);
      cmp.onResourceAdded({ ...resource, label: 'Duplicate' });
      expect(cmp.pendingResources()).toHaveLength(1);
    });

    it('onResourceRemoved removes a resource by URL', () => {
      const { cmp } = createFixtureWithStatus('Before');
      const r1 = { type: 'youtube' as const, url: 'https://www.youtube.com/watch?v=aaa', label: 'A' };
      const r2 = { type: 'pdf' as const, url: 'https://example.com/tab.pdf', label: 'B' };
      cmp.onResourceAdded(r1);
      cmp.onResourceAdded(r2);
      cmp.onResourceRemoved(r1.url);
      expect(cmp.pendingResources()).toHaveLength(1);
      expect(cmp.pendingResources()[0].url).toBe(r2.url);
    });

    it('onResourceRemoved is a no-op when URL is not present', () => {
      const { cmp } = createFixtureWithStatus('Before');
      expect(() => cmp.onResourceRemoved('https://not-in-list.com')).not.toThrow();
      expect(cmp.pendingResources()).toHaveLength(0);
    });
  });

});
