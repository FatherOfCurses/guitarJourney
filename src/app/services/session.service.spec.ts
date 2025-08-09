import { SessionService } from "./session.service";
import { TestBed } from "@angular/core/testing";
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { Session } from "../models/session";

describe('SessionService', () => {
  let httpTestingController: HttpTestingController;
  let service: SessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      
      providers: [SessionService, provideHttpClientTesting]
    });

    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(SessionService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('getSession should return expected session', (done) => {
    const expectedData: Session = {
      id: 'id12345',
      date: '10/01/2021',
      practiceTime: 45,
      whatToPractice: 'Stairway to Heaven',
      sessionIntent: 'Get acoustic fingerpicking down',
      postPracticeReflection: 'Worked pretty well, was able to play at 90% speed',
      goalForNextTime: 'Fingerpicking at 100%'
    };

    service.getSession$("id12345").subscribe({
      next: (actualData) => {
        expect(actualData).toEqual(expectedData);
        done();
      },
      error: (err) => {
        fail(`Unexpected error: ${err}`);
        done();
      }
    });

    const testRequest = httpTestingController.expectOne('https://dx471dpyrj.execute-api.us-west-2.amazonaws.com/sessions/id12345');
    expect(testRequest.request.method).toBe('GET');
    testRequest.flush(expectedData);
  });

  it('getAllSessions should return all sessions', (done) => {
    const expectedData = [
      {
        id: 'id12345',
        date: '10/01/2021',
        practiceTime: 45,
        whatToPractice: 'Stairway to Heaven',
        sessionIntent: 'Get acoustic fingerpicking down',
        postPracticeReflection: 'Worked pretty well, was able to play at 90% speed',
        goalForNextTime: 'Fingerpicking at 100%'
      },
      {
        id: 'id98764',
        date: '10/31/2021',
        practiceTime: 20,
        whatToPractice: 'Paradise City',
        sessionIntent: 'Try playing solo all the way through',
        postPracticeReflection: 'Really rough, dont think I made it all the way through',
        goalForNextTime: 'Spend more time warming up before practice'
      }
    ];

    service.getAllSessions$().subscribe({
      next: (actualData) => {
        expect(actualData).toEqual(expectedData);
        done();
      },
      error: (err) => {
        fail(`Unexpected error: ${err}`);
        done();
      }
    });

    const testRequest = httpTestingController.expectOne('https://dx471dpyrj.execute-api.us-west-2.amazonaws.com/sessions');
    expect(testRequest.request.method).toBe('GET');
    testRequest.flush(expectedData);
  });

  it('putSession should send data and return the updated session', (done) => {
    const inputData: Session = {
      id: 'id12345',
      date: '10/01/2021',
      practiceTime: 45,
      whatToPractice: 'Stairway to Heaven',
      sessionIntent: 'Get acoustic fingerpicking down',
      postPracticeReflection: 'Worked pretty well, was able to play at 90% speed',
      goalForNextTime: 'Fingerpicking at 100%'
    };

service.putSession$(inputData).subscribe({  
  next: (response) => {
    expect(response).toEqual(inputData);
    done();
  },
  error: (err) => {
    fail(`Unexpected error: ${err}`);
    done();
  }
});

    const testRequest = httpTestingController.expectOne('https://dx471dpyrj.execute-api.us-west-2.amazonaws.com/sessions');
    expect(testRequest.request.method).toBe('PUT');
    expect(testRequest.request.body).toEqual(inputData);
    testRequest.flush(inputData);
  });
});
