import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let fixture: ComponentFixture<HomeComponent>;

  const mockSessions = [
    { id: '1', startedAt: '2025-08-01T10:00:00Z', durationMs: 30_000 },
    { id: '2', startedAt: '2025-08-02T10:00:00Z', durationMs: 60_000 },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent], // standalone
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);

    // IMPORTANT: set required input BEFORE first detectChanges
    fixture.componentRef.setInput('sessions', mockSessions);

    // (optional) set other inputs if you want
    // fixture.componentRef.setInput('loading', false);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
