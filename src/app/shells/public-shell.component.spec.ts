import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { PublicShellComponent } from './public-shell.component';

describe('PublicShellComponent', () => {
  let fixture: ComponentFixture<PublicShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicShellComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(PublicShellComponent);
    fixture.detectChanges();
  });

  it('creates the component', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('currentYear equals the current calendar year', () => {
    expect(fixture.componentInstance.currentYear).toBe(new Date().getFullYear());
  });
});
