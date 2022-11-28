import { ComponentFixture, TestBed } from '@angular/core/testing'
import { FormBuilder, ReactiveFormsModule } from '@angular/forms'
import { SessionComponent } from './session.component'
import { RouterTestingModule } from '@angular/router/testing'
import { SessionModule } from './session.module'
import { HttpClient, HttpHandler } from '@angular/common/http'
import { SessionService } from '../../services/session.service'
import SessionServiceMock from '../../../__mocks__/services/session.service.mock'
import { CdTimerComponent, CdTimerModule } from "angular-cd-timer";
import { NO_ERRORS_SCHEMA } from "@angular/compiler";

describe('SessionComponent', () => {
  let component: SessionComponent;
  let fixture: ComponentFixture<SessionComponent>;
  let sessionFormElement: Element;
  let afterFormElement: Element;
  let componentElement: Element;
  let sessionInputElements: NodeListOf<HTMLElement>;
  let sessionTextElements: NodeListOf<HTMLElement>;
  let afterTextElements: NodeListOf<HTMLElement>;
  let practiceTimeInputField: HTMLInputElement;
  let sessionIntentInputField: HTMLInputElement;
  let whatToPracticeTextareaField: HTMLTextAreaElement;
  let sessionReflectionInputField: HTMLTextAreaElement;
  let goalForNextTimeInputField: HTMLTextAreaElement;
  let startButton: HTMLButtonElement;
  let endButton: HTMLButtonElement;
  let finishButton: HTMLButtonElement;
  let timer: boolean;
  // TODO: mock session service so submit button doesn't cause freakout

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        SessionModule,
      ],
      providers: [
        FormBuilder,
        HttpClient,
        HttpHandler,
        CdTimerModule,
        CdTimerComponent,
        {
          provide: SessionService,
          use: SessionServiceMock,
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
    fixture = TestBed.createComponent(SessionComponent);
    component = fixture.componentInstance;
    componentElement = fixture.debugElement.nativeElement;
    sessionFormElement = componentElement.querySelector('#sessionForm');
    afterFormElement = componentElement.querySelector('#afterForm');
    startButton = componentElement.querySelector('#startButton');
    endButton = componentElement.querySelector('#endButton');
    finishButton = componentElement.querySelector('#finishButton');
    sessionInputElements = sessionFormElement.querySelectorAll('input');
    sessionTextElements = sessionFormElement.querySelectorAll('textarea')
    afterTextElements = afterFormElement.querySelectorAll('textarea');
    practiceTimeInputField = sessionFormElement.querySelectorAll('input')[0];
    whatToPracticeTextareaField = sessionFormElement.querySelectorAll('textarea')[0];
    sessionIntentInputField = sessionFormElement.querySelectorAll('input')[1];
    sessionReflectionInputField = afterFormElement.querySelectorAll('textarea')[0];
    goalForNextTimeInputField = afterFormElement.querySelectorAll('textarea')[1];
    fixture.detectChanges();
  })

  it('should create', async () => {
    expect(component).toBeTruthy()
  });

  it('should render all input fields', () => {
    expect(sessionInputElements.length).toEqual(2);
    expect(sessionTextElements.length).toEqual(1);
    expect(afterTextElements.length).toEqual(2);
  });

  describe('ensuring all form inputs are registered', () => {

    it('should capture input for practice time', () => {
      practiceTimeInputField.value = '10';
      practiceTimeInputField.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        const practiceTimeValueFromGroup = component.sessionForm.get('practiceTime');
        expect(practiceTimeInputField.value).toEqual(practiceTimeValueFromGroup.value);
        expect(practiceTimeValueFromGroup.errors).toBeNull();
      });
    });

    it('should capture input for what to practice', () => {
      whatToPracticeTextareaField.value = 'Shoulder shank jerky, turducken shankle ham hock porchetta kielbasa hamburger turkey burgdoggen beef spare ribs fatback. Pork loin landjaeger tongue drumstick short ribs pastrami tail turducken short loin meatloaf andouille sirloin flank swine cow. Turkey filet mignon strip steak, pork chop kielbasa pork belly jerky prosciutto fatback chislic pastrami chuck cupim. Jowl shoulder kielbasa landjaeger bresaola, venison meatloaf capicola leberkas.';
      whatToPracticeTextareaField.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        const whatToPracticeValueFromGroup = component.sessionForm.get('whatToPractice');
        expect(whatToPracticeTextareaField.value).toEqual(whatToPracticeValueFromGroup.value);
        expect(whatToPracticeValueFromGroup.errors).toBeNull();
      });
    });

    it('should capture input for session intent', () => {
      sessionIntentInputField.value = 'Some statement of intent that should be meaningful';
      sessionIntentInputField.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        const sessionIntentValueFromGroup = component.sessionForm.get('sessionIntent');
        expect(sessionIntentInputField.value).toEqual(sessionIntentValueFromGroup.value);
        expect(sessionIntentValueFromGroup.errors).toBeNull();
      });
    });

    it('should capture input for session reflection', () => {
      sessionReflectionInputField.value = 'Landjaeger porchetta picanha beef ribs tail alcatra. Jerky t-bone chuck drumstick, beef ribs short loin kielbasa short ribs ham hock meatloaf cupim pancetta. Porchetta alcatra pastrami pancetta drumstick pork beef buffalo landjaeger meatloaf cupim tri-tip ribeye prosciutto salami. Venison rump chislic turkey flank shank. Buffalo pork loin shoulder pig biltong, strip steak salami swine t-bone meatloaf beef ribs. Frankfurter sirloin chuck chislic venison. Hamburger corned beef venison spare ribs, andouille chislic drumstick pancetta.';
      sessionReflectionInputField.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        const sessionReflectionValueFromGroup = component.afterForm.get('sessionReflection');
        expect(sessionReflectionInputField.value).toEqual(sessionReflectionValueFromGroup.value);
        expect(sessionReflectionValueFromGroup.errors).toBeNull();
      });
    });

    it('should capture input for what to practice', () => {
      goalForNextTimeInputField.value = 'Spare ribs tail tenderloin t-bone venison pancetta biltong. Swine flank meatloaf kielbasa. Pastrami drumstick turducken pig bacon kevin salami flank porchetta strip steak corned beef pork chop biltong jowl. Capicola fatback ham hock ground round frankfurter bresaola cow. Fatback cupim tongue alcatra frankfurter, kevin chuck kielbasa tri-tip hamburger boudin leberkas rump tenderloin. Short loin bacon spare ribs brisket chislic alcatra shank shankle corned beef tail doner. Prosciutto short ribs tri-tip fatback alcatra andouille chislic landjaeger frankfurter burgdoggen drumstick jowl brisket tail venison.';
      goalForNextTimeInputField.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        const goalForNextTimeValueFromGroup = component.afterForm.get('goalForNextTime');
        expect(goalForNextTimeInputField.value).toEqual(goalForNextTimeValueFromGroup.value);
        expect(goalForNextTimeValueFromGroup.errors).toBeNull();
      });
    });

    // negative test cases?
  });

  it('stores form values in the session object on submit', () => {
    practiceTimeInputField.value = '10';
    practiceTimeInputField.dispatchEvent(new Event('input'));
    whatToPracticeTextareaField.value = 'Shoulder shank jerky, turducken shankle ham hock porchetta kielbasa hamburger turkey burgdoggen beef spare ribs fatback. Pork loin landjaeger tongue drumstick short ribs pastrami tail turducken short loin meatloaf andouille sirloin flank swine cow. Turkey filet mignon strip steak, pork chop kielbasa pork belly jerky prosciutto fatback chislic pastrami chuck cupim. Jowl shoulder kielbasa landjaeger bresaola, venison meatloaf capicola leberkas.';
    whatToPracticeTextareaField.dispatchEvent(new Event('input'));
    sessionIntentInputField.value = 'Some statement of intent that should be meaningful';
    sessionIntentInputField.dispatchEvent(new Event('input'));
    sessionReflectionInputField.value = 'Landjaeger porchetta picanha beef ribs tail alcatra. Jerky t-bone chuck drumstick, beef ribs short loin kielbasa short ribs ham hock meatloaf cupim pancetta. Porchetta alcatra pastrami pancetta drumstick pork beef buffalo landjaeger meatloaf cupim tri-tip ribeye prosciutto salami. Venison rump chislic turkey flank shank. Buffalo pork loin shoulder pig biltong, strip steak salami swine t-bone meatloaf beef ribs. Frankfurter sirloin chuck chislic venison. Hamburger corned beef venison spare ribs, andouille chislic drumstick pancetta.';
    sessionReflectionInputField.dispatchEvent(new Event('input'));
    goalForNextTimeInputField.value = 'Spare ribs tail tenderloin t-bone venison pancetta biltong. Swine flank meatloaf kielbasa. Pastrami drumstick turducken pig bacon kevin salami flank porchetta strip steak corned beef pork chop biltong jowl. Capicola fatback ham hock ground round frankfurter bresaola cow. Fatback cupim tongue alcatra frankfurter, kevin chuck kielbasa tri-tip hamburger boudin leberkas rump tenderloin. Short loin bacon spare ribs brisket chislic alcatra shank shankle corned beef tail doner. Prosciutto short ribs tri-tip fatback alcatra andouille chislic landjaeger frankfurter burgdoggen drumstick jowl brisket tail venison.';
    goalForNextTimeInputField.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    finishButton.click();
    let sessionRecord = component.session;
    fixture.whenStable().then(() => {
      expect(sessionRecord.practiceTime).toEqual(practiceTimeInputField.value);
      expect(sessionRecord.whatToPractice).toEqual(whatToPracticeTextareaField.value);
      expect(sessionRecord.sessionIntent).toEqual(sessionIntentInputField.value);
      expect(sessionRecord.postPracticeReflection).toEqual(sessionReflectionInputField.value);
      expect(sessionRecord.goalForNextTime).toEqual(goalForNextTimeInputField.value);
    });
  });

  it('should start timer on Start click', () => {
    startButton = componentElement.querySelector('#startButton');
    startButton.click();
    fixture.detectChanges();
    fixture.whenStable().then(() => (
      expect(component.sessionStatus).toBe("begin")
    ));
  });

  it('should stop timer on Stop click', () => {
    timer = true;
    endButton = componentElement.querySelector('#endButton');
    endButton.click();
    fixture.detectChanges();
    fixture.whenStable().then(() => (
      expect(component.sessionStatus).toBe("finished")
    ));
  });

  // display a session-timer
  // display correct time on session-timer
  // allow pause and restart
  // record total time on finish

});
