import { TestBed } from '@angular/core/testing';
import { SessionService } from './session.service';
import { HttpClient } from '@angular/common/http';
import { Session } from '../models/session';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { of } from 'rxjs';

describe('SessionService', () => {
  let service: SessionService;
  let httpTestingController: HttpTestingController;
  const baseUrl = 'someURL/sessions';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [
        {
        provide: SessionService,
        useValue: {
          postSession$: jest.fn(() => of({
            sessionIntent: 'Nail solo on Time',
            date: 99,
            practiceTime: 30,
            goalForNextTime: 'Money timing at 80bpm',
            postPracticeReflection: 'Had a lot of fun on Great Gig in the Sky, timing was a little off on Money',
            whatToPractice: 'Dark Side of the Moon',
            id: 'ID3928hheds872'
            }
          ))
        }
      }]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(SessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should make a request to POST session to endpoint', () => {
    const mockSessionSinglePayload: Session = {
      sessionIntent: 'Nail solo on Time',
      date: '2012-02-12',
      practiceTime: 30,
      goalForNextTime: 'Money timing at 80bpm',
      postPracticeReflection: 'Had a lot of fun on Great Gig in the Sky, timing was a little off on Money',
      whatToPractice: 'Dark Side of the Moon',
      id: 'ID3928hheds872'
    }
    const session$ = service.putSession$(mockSessionSinglePayload);
    const req = httpTestingController.expectOne(baseUrl, JSON.stringify(mockSessionSinglePayload));
    expect(req.request.body).toEqual(mockSessionSinglePayload);
    expect(req.request.method).toEqual('PUT');
    req.flush('');
    httpTestingController.verify();
  });
});
