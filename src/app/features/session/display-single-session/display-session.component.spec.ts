import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplaySessionComponent } from './display-session.component';

describe('DisplaySessionComponent', () => {
  let component: DisplaySessionComponent;
  let fixture: ComponentFixture<DisplaySessionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplaySessionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplaySessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
