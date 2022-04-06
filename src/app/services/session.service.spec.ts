import { TestBed } from '@angular/core/testing';

import { SessionService } from './session.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { Session } from '../models/session';

describe('SessionService', () => {
  let service: SessionService;
  const baseUrl = '/api/session';
  const mockSessionSinglePayload: Session = {
    sessionIntent: 'Nail solo on Time',
    date: 99,
    practiceTime: 30,
    goalForNextTime: 'Money timing at 80bpm',
    postPracticeReflection: 'Had a lot of fun on Great Gig in the Sky, timing was a little off on Money',
    whatToPractice: 'Dark Side of the Moon',
    id: 'ID3928hheds872'
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpClient, HttpHandler]
    });
    service = TestBed.inject(SessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
