import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';

describe('AppComponent', () => {
  let component: AppComponent;
  let compiled: Element;
  const PAGE_TITLE = 'Guitar Journey';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        AppComponent
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
    const fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement;
    fixture.detectChanges();
  }));

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should have as title 'guitar-practice-journal'`, () => {
    expect(component.title).toEqual('guitar-practice-journal');
  });

  it('should render title', () => {
    expect(compiled.querySelector('[data-app-title]').textContent).toContain(PAGE_TITLE);
  });
});
