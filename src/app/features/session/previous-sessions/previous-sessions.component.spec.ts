import { ComponentFixture, TestBed } from '@angular/core/testing'
import { of, Subscription, throwError } from "rxjs";
import { PreviousSessionsComponent } from "./previous-sessions.component";
import { Session } from "../../../models/session";
import { HttpClient, HttpHandler } from "@angular/common/http";
import { SessionService } from "../../../services/session.service";

describe('PreviousSessionsComponent_class', () => {
    let previousSessionComponent: PreviousSessionsComponent;
    const mockSession: Session = {
      id: '1',
      date: '2022-01-01',
      practiceTime: 60,
      whatToPractice: 'scales',
      sessionIntent: 'improve technique',
      postPracticeReflection: 'went well',
      goalForNextTime: 'do even better'
    };
    let mockSessionService;
    let fixture = TestBed.createComponent(PreviousSessionsComponent);


    beforeEach(async () => {
      await TestBed.configureTestingModule({
        declarations: [PreviousSessionsComponent],
        providers: [HttpClient, HttpHandler, SessionService]
      }).compileComponents();
      mockSessionService = {
        getSession$: jest.fn(),
        putSession$: jest.fn()
      }
      let getSessionSpy = jest.spyOn(mockSessionService, 'get').mockReturnValue(mockSession);
      let putSessionSpy = jest.spyOn(mockSessionService, 'put').mockReturnValue('success');
      previousSessionComponent = fixture.componentInstance;
      previousSessionComponent.ngOnInit();
      fixture.detectChanges();
    });

    it("retrieves all sessions", () => {
      expect(previousSessionComponent.sessionData).toEqual([{
        id: '1',
        date: '2022-01-01',
        practiceTime: 60,
        whatToPractice: 'scales',
        sessionIntent: 'improve technique',
        postPracticeReflection: '',
        goalForNextTime: ''
      }]);
      expect(mockSessionService.getAllSessions$).toHaveBeenCalled();
    });

    it("retrieves one session", () => {
      expect(mockSessionService.getSession$).toHaveBeenCalledWith('1');
    });

    it("transforms data into session object", () => {
      expect(Array.isArray(previousSessionComponent.sessionData)).toBe(true);
      expect(previousSessionComponent.sessionData[0]).toBeInstanceOf(Session);
    });

    it("successfully updates session", () => {
      expect(mockSessionService.putSession$()).toBeInstanceOf(Subscription);
      expect(mockSessionService.putSession$).toHaveBeenCalledWith(mockSession);
    });
  });
  ``
