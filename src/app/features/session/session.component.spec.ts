import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {SessionComponent} from './session.component';
import { RouterTestingModule } from '@angular/router/testing';
import { SessionModule } from './session.module';
import { HttpClient, HttpHandler } from '@angular/common/http';

describe('SessionComponent', () => {
  let component: SessionComponent;
  let fixture: ComponentFixture<SessionComponent>;

  beforeEach( () => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule, SessionModule],
      providers: [ FormBuilder, HttpClient, HttpHandler ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
    fixture = TestBed.createComponent(SessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
