import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SessionAfterComponent } from './session-after.component';
import {ReactiveFormsModule} from '@angular/forms';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { LandingPageComponent } from '../../landing-page/landing-page.component';
import { Router } from '@angular/router';

describe('SessionAfterComponent', () => {
  let component: SessionAfterComponent;
  let fixture: ComponentFixture<SessionAfterComponent>;
  let router: Router;

  beforeEach( () => {
    TestBed.configureTestingModule({
      declarations: [ SessionAfterComponent ],
      imports: [ReactiveFormsModule,
      RouterTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
    fixture = TestBed.createComponent(SessionAfterComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to landing page on completion', async () => {
    component.onSubmit();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(router.url).toBe('/');
  });
});
