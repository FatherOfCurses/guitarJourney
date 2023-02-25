import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { SessionService } from "./session.service";
import { TestBed } from "@angular/core/testing";
import { Session } from "../models/session";
import { response } from "express";

describe('SessionService', () => {
  let httpTestingController: HttpTestingController;
  let service: SessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    httpTestingController = TestBed.get(HttpTestingController);
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

    service.getSession$("id12345").subscribe(actualData => {
      expect(actualData).toEqual(expectedData);
      done();
    });

    const testRequest = httpTestingController.expectOne('https://dx471dpyrj.execute-api.us-west-2.amazonaws.com/sessions/id12345');
    testRequest.flush(expectedData);
  });

  it('getAll should return all sessions', (done) => {
    const expectedData =[
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

    service.getAllSessions$().subscribe(actualData => {
      expect(actualData).toEqual(expectedData);
      done();
    });

    const testRequest = httpTestingController.expectOne('https://dx471dpyrj.execute-api.us-west-2.amazonaws.com/sessions');
    testRequest.flush(expectedData);
  });

  // TODO: refine this test to be more precise
  it('putSession should have a response', (done) => {
    const expectedData: Session = {
      id: 'id12345',
      date: '10/01/2021',
      practiceTime: 45,
      whatToPractice: 'Stairway to Heaven',
      sessionIntent: 'Get acoustic fingerpicking down',
      postPracticeReflection: 'Worked pretty well, was able to play at 90% speed',
      goalForNextTime: 'Fingerpicking at 100%'
    };

    const putRecord = service.putSession$(expectedData);
    done();
    expect(putRecord).toBeTruthy();

    const testRequest = httpTestingController.expectOne('https://dx471dpyrj.execute-api.us-west-2.amazonaws.com/sessions');
    testRequest.flush(expectedData);
  });
});
