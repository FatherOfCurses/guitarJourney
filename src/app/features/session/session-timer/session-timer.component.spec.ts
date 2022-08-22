import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SessionTimerComponent } from './session-timer.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import 'angular-cd-timer';

describe('TimerComponent', () => {
  let component: SessionTimerComponent;
  let fixture: ComponentFixture<SessionTimerComponent>;

  beforeEach( () => {
    TestBed.configureTestingModule({
      declarations: [ SessionTimerComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
    fixture = TestBed.createComponent(SessionTimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });



  // display a session-timer
  // display correct time on session-timer
  // allow pause and restart
  // record total time on finish
});
