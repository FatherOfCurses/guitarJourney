import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SongsComponent } from './songs.component';
import { SongsService } from '@services/songs.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('SongsComponent', () => {
  let component: SongsComponent;
  let fixture: ComponentFixture<SongsComponent>;

  const mockSongsService = {
    list$: jest.fn().mockReturnValue(of([])),
  };

  const mockRouter = {
    navigate: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SongsComponent],
    })
    .overrideComponent(SongsComponent, {
      set: {
        providers: [
          { provide: SongsService, useValue: mockSongsService },
          { provide: Router, useValue: mockRouter },
        ],
      },
    })
    .compileComponents();

    fixture = TestBed.createComponent(SongsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
