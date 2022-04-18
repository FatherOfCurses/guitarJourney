import { TestBed } from '@angular/core/testing';

import { SongsterrService } from './songsterr.service';
import { HttpClient, HttpHandler } from '@angular/common/http';

describe('SongsterrService', () => {
  let service: SongsterrService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpClient, HttpHandler]
    });
    service = TestBed.inject(SongsterrService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
