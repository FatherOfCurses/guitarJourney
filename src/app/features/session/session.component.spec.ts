import { ComponentFixture, TestBed } from '@angular/core/testing'
import { FormBuilder, ReactiveFormsModule } from '@angular/forms'
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
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


  beforeEach(() => {
    TestBed.configureTestingModule({
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
    fixture.detectChanges();

  })

  it('should create', async () => {
    expect(component).toBeTruthy()
  });

  it('should render all input fields',  () => {
    const sessionFormElement = fixture.debugElement.nativeElement.querySelector('#sessionForm');
    const afterFormElement = fixture.debugElement.nativeElement.querySelector('#afterForm');
    const sessionInputElements = sessionFormElement.querySelectorAll('input');
    const sessionTextElements = sessionFormElement.querySelectorAll('textarea')
    const afterTextElements = afterFormElement.querySelectorAll('textarea');
    expect(sessionInputElements.length).toEqual(2);
    expect(sessionTextElements.length).toEqual(1);
    expect(afterTextElements.length).toEqual(2);
  });

  it('should subscribe to form changes',  () => {
    const sessionFormElement = fixture.debugElement.nativeElement.querySelector('#sessionForm');
    const afterFormElement = fixture.debugElement.nativeElement.querySelector('#afterForm');
    const sessionInputElements = sessionFormElement.querySelectorAll('input');
    const sessionTextElements = sessionFormElement.querySelectorAll('textarea');
    const afterTextElements = afterFormElement.querySelectorAll('textarea');
    const practiceTimeInputField: HTMLInputElement = sessionFormElement.querySelectorAll('input')[0];
    practiceTimeInputField.value = '10';
    practiceTimeInputField.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const practiceTimeValueFromGroup = component.sessionForm.get('practiceTime');
      expect(practiceTimeInputField.value).toEqual(practiceTimeValueFromGroup.value);
    });
  });

  // display a session-timer
  // display correct time on session-timer
  // allow pause and restart
  // record total time on finish

});
