import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SessionBeforeComponent } from './session-before.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import {Router} from '@angular/router';
import {SessionDuringComponent} from '../session-2-during/session-during.component';

describe('SessionBeforeComponent', () => {
  let fixture: ComponentFixture<SessionBeforeComponent>;
  let startButton: any;
  let component: SessionBeforeComponent;
  let router: Router;

  beforeEach( () => {
    TestBed.configureTestingModule({
      declarations: [ SessionBeforeComponent, SessionDuringComponent ],
      imports: [ReactiveFormsModule,
        RouterTestingModule.withRoutes([{path: 'sessionDuring', component: SessionDuringComponent}])],
      providers: [],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
    fixture = TestBed.createComponent(SessionBeforeComponent);
    component = fixture.componentInstance;
    startButton = fixture.nativeElement.querySelector('[data-start-button]');
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to session record on submit', async () => {
    const validSessionRecord = {
      practiceTimeControl: 60,
      whatToPractice: 'Stairway to Heaven',
      sessionIntent: 'get better'
    };
    component.sessionForm.setValue(validSessionRecord);
    component.onSubmit();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(router.url).toBe('/sessionDuring');
  });

  describe('field validation', () => {

    it('should not enable Start button when practice time blank', async () => {
      const missingPracticeTime = {
        practiceTimeControl: 0,
        whatToPractice: 'Stairway to Heaven',
        sessionIntent: 'get better'
      };
      component.sessionForm.setValue(missingPracticeTime);
      fixture.detectChanges();
      await fixture.whenStable();
      expect(startButton.disabled).toBeTruthy();
    });

    it('should not enable Start button when what to practice blank', async () => {
      const missingWhatToPractice = {
        practiceTimeControl: 60,
        whatToPractice: '',
        sessionIntent: 'get better'
      };
      component.sessionForm.setValue(missingWhatToPractice);
      fixture.detectChanges();
      await fixture.whenStable();
      expect(startButton.disabled).toBeTruthy();
    });

    it('should not enable Start button when session intent blank', async () => {
      const missingSessionIntent = {
        practiceTimeControl: 60,
        whatToPractice: 'some stuff',
        sessionIntent: ''
      };
      component.sessionForm.setValue(missingSessionIntent);
      fixture.detectChanges();
      await fixture.whenStable();
      expect(startButton.disabled).toBeTruthy();
    });
  });

});
