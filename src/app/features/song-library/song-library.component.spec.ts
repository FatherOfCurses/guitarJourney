import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SongLibraryComponent } from './song-library.component';

describe('CongLibraryComponent', () => {
  let component: SongLibraryComponent;
  let fixture: ComponentFixture<SongLibraryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SongLibraryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SongLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
