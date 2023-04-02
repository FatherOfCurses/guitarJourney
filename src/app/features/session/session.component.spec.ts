import { ComponentFixture, TestBed } from '@angular/core/testing'
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { SessionComponent } from './session.component'
import { RouterTestingModule } from '@angular/router/testing'
import { SessionModule } from './session.module'
import { HttpClient, HttpHandler } from '@angular/common/http'
import { SessionService } from '../../services/session.service'
import SessionServiceMock from '../../../__mocks__/services/session.service.mock'
import { CdTimerComponent, CdTimerModule } from "angular-cd-timer";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

describe('SessionComponent', () => {
  let component: SessionComponent;
  let fixture: ComponentFixture<SessionComponent>;
  let sessionForm: FormGroup;
  let afterForm: FormGroup;
  let sessionStatus: String;

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

  describe('Pre-session form',  () => {
    beforeEach(async () => {
      sessionStatus = 'before';
      sessionForm = component.sessionForm;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(sessionForm).toBeTruthy();
    });
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
  });

  describe('Form submission', () => {
    beforeEach(async () => {
      sessionStatus = 'after';

    })
  })
});



