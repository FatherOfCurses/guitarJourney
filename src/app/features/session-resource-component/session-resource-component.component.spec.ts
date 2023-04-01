import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionResourceComponentComponent } from './session-resource-component.component';

describe('SessionResourceComponentComponent', () => {
  let component: SessionResourceComponentComponent;
  let fixture: ComponentFixture<SessionResourceComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SessionResourceComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SessionResourceComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
