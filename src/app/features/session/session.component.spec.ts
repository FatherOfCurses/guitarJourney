import { ComponentFixture, TestBed } from '@angular/core/testing'
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { SessionComponent } from './session.component'
import { RouterTestingModule } from '@angular/router/testing'
import { SessionModule } from './session.module'
import { HttpClient, HttpHandler } from '@angular/common/http'
import { SessionService } from '../../services/session.service'
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import SessionServiceMock from "../../../__mocks__/services/session.service.mock";
import { Session } from "../../models/session";
import { RouterModule } from "@angular/router";

describe('SessionComponent', () => {
  let component: SessionComponent;
  let fixture: ComponentFixture<SessionComponent>;
  let prePracticeForm: FormGroup;
  let afterForm: FormGroup;
  let sessionStatus: String;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        SessionModule,
        RouterModule
      ],
      providers: [
        FormBuilder,
        HttpClient,
        HttpHandler,
        RouterModule,
        { provide: SessionService, useValue: SessionServiceMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
    fixture = TestBed.createComponent(SessionComponent);
    component = fixture.componentInstance;
    sessionStatus = component.sessionStatus;
    fixture.detectChanges();
  });

  it('should create', async () => {
    expect(component).toBeTruthy()
  });

  it("successfully captures form inputs", () => {
    const mockSession: Session = {
      id: '1234565',
      practiceTime: 30,
      date: '2023-04-19',
      whatToPractice: 'Lots and lots of things',
      sessionIntent: 'Be awesome',
      postPracticeReflection: 'went well',
      goalForNextTime: 'use a metronome'
    }
    component.initializeForm();
    component.subscribeToFormChanges();
    component.prePracticeForm.patchValue({ practiceTime: 30 });
    component.prePracticeForm.patchValue({whatToPractice: 'Lots and lots of things'});
    component.prePracticeForm.patchValue({sessionIntent: 'be awesome'});
    component.afterForm.patchValue({sessionReflection: 'went well'});
    component.afterForm.patchValue({goalForNextTime: 'have more fun'});
    component.onSubmit();
    expect(SessionServiceMock.putSession$).toHaveBeenCalled();
  });

  describe('Pre-session form',  () => {
    beforeEach(async () => {
      sessionStatus = 'before';
      prePracticeForm = component.prePracticeForm;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(prePracticeForm).toBeTruthy();
    });

    it('should not allow invalid data in pre-practice form', () => {
      prePracticeForm.patchValue({practiceTime: 'zzzzz'});
      expect(component.practiceTimeValid).toEqual('invalid');
      prePracticeForm.patchValue({whatToPractice: ''});
      expect(component.whatToPracticeValid).toEqual('invalid');
      prePracticeForm.patchValue({sessionIntent: ''});
      expect(component.sessionIntentValid).toEqual("invalid");
    });

    it('should allow valid data in pre-practice form', () => {
      prePracticeForm.patchValue({practiceTime: '30'});
      expect(component.practiceTimeValid).toEqual("valid");
      prePracticeForm.patchValue({whatToPractice: 'Lots and lots of things'});
      expect(component.practiceTimeValid).toEqual("valid");
      prePracticeForm.patchValue({sessionIntent: 'Be awesome'});
      expect(component.practiceTimeValid).toEqual("valid");
    })
  });

  describe('After form', () => {
    beforeEach(async () => {
      sessionStatus = 'after';
      afterForm = component.afterForm;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(afterForm).toBeTruthy();
    });

    it('should not allow invalid data in after form', () => {
      afterForm.patchValue({sessionReflection: ''});
      expect(component.sessionReflectionValid).toEqual('invalid');
      afterForm.patchValue({goalForNextTime: ''});
      expect(component.goalForNextTimeValid).toEqual('invalid');
    });

    it('should allow valid data in after form', () => {
      afterForm.patchValue({sessionReflection: 'I think it went pretty well'});
      expect(component.sessionReflectionValid).toEqual('valid');
      afterForm.patchValue({goalForNextTime: 'Dont forget to use a metronome'});
      expect(component.goalForNextTimeValid).toEqual('valid');
    })
  });
});


