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
  let component: SessionComponent
  let fixture: ComponentFixture<SessionComponent>

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
    }).compileComponents()
    fixture = TestBed.createComponent(SessionComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', async () => {
    expect(component).toBeTruthy()
  });

  // display a session-timer
  // display correct time on session-timer
  // allow pause and restart
  // record total time on finish

});
