import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LandingPageComponent } from './landing-page.component';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';

describe('LandingPageComponent', () => {
  let fixture: ComponentFixture<LandingPageComponent>;
  let component: LandingPageComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ LandingPageComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
    fixture = TestBed.createComponent(LandingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the greeting card', () => {
    const compiled = fixture.nativeElement;
    const greeting = compiled.querySelector('[data-greeting]');
    expect(greeting).toBeTruthy();
  });

});
