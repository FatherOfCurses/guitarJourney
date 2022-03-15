import { TestBed } from '@angular/core/testing';

import { SongsterrService } from './songsterr.service';

describe('SongsterrService', () => {
  let service: SongsterrService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SongsterrService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
