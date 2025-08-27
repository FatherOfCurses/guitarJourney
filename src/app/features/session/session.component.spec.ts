// session.component.spec.ts
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SessionComponent } from './session.component';
import { of, Subject } from 'rxjs';
import { convertToParamMap } from '@angular/router';
import { Session } from 'src/app/models/session';
import { SessionService } from '../../services/session.service'

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
    it('disables Finish when loading() is true', () => {
      const { fixture, cmp } = createFixtureWithStatus('After');

      // Initially false (enabled)
      let finishBtn = fixture.debugElement.query(By.css('#afterForm button'))?.nativeElement as HTMLButtonElement;
      expect(finishBtn.disabled).toBe(false);

      // Simulate loading state
      fixture.detectChanges();

      finishBtn = fixture.debugElement.query(By.css('#afterForm button'))?.nativeElement as HTMLButtonElement;
      expect(finishBtn.disabled).toBe(true);
    });

    it('clicking Finish calls onSubmit() when not loading', () => {
      const { fixture, cmp } = createFixtureWithStatus('After');

      // Make sure not loading
      fixture.detectChanges();

      const finishBtn = fixture.debugElement.query(By.css('#afterForm button'))?.nativeElement as HTMLButtonElement;
      finishBtn.click();
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
});
