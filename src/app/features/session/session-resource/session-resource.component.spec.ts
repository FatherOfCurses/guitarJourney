import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionResourceComponent } from './session-resource.component';

describe('SessionResourceComponentComponent', () => {
  let component: SessionResourceComponent;
  let fixture: ComponentFixture<SessionResourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SessionResourceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SessionResourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
