import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TimerComponent } from './timer.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('TimerComponent', () => {
  let component: TimerComponent;
  let fixture: ComponentFixture<TimerComponent>;

  beforeEach( () => {
    TestBed.configureTestingModule({
      declarations: [ TimerComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
    fixture = TestBed.createComponent(TimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // display a timer
  // display correct time on timer
  // allow pause and restart
  // record total time on finish
});
