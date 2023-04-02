import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionResourcePickerComponent } from './session-resource-picker.component';

describe('SessionResourcePickerComponent', () => {
  let component: SessionResourcePickerComponent;
  let fixture: ComponentFixture<SessionResourcePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SessionResourcePickerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SessionResourcePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
