import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SessionDuringComponent } from './session-during.component';
import {Router} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {SessionAfterComponent} from '../session-3-after/session-after.component';
import {ReactiveFormsModule} from '@angular/forms';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';

describe('SessionDuringComponent', () => {
  let component: SessionDuringComponent;
  let fixture: ComponentFixture<SessionDuringComponent>;
  let router: Router;

  beforeEach( () => {
    TestBed.configureTestingModule({
      declarations: [ SessionDuringComponent, SessionAfterComponent ],
      imports: [ ReactiveFormsModule,
        RouterTestingModule.withRoutes([{path: 'sessionAfter', component: SessionAfterComponent}])],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
    fixture = TestBed.createComponent(SessionDuringComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });
  // test click finish button
  it('should navigate to session-3-after on completion', async () => {
    component.finishSession();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(router.url).toBe('/sessionAfter');
  });
});
