import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SessionAfterComponent } from './session-after.component';
import {ReactiveFormsModule} from '@angular/forms';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';

describe('SessionAfterComponent', () => {
  let component: SessionAfterComponent;
  let fixture: ComponentFixture<SessionAfterComponent>;

  beforeEach( () => {
    TestBed.configureTestingModule({
      declarations: [ SessionAfterComponent ],
      imports: [ReactiveFormsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
    fixture = TestBed.createComponent(SessionAfterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
