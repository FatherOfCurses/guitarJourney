import { ComponentFixture, TestBed } from '@angular/core/testing'
import { Observable, of, Subscription, throwError } from "rxjs";
import { PreviousSessionsComponent } from "./previous-sessions.component";
import { Session } from "../../../models/session";
import { HttpClient, HttpHandler } from "@angular/common/http";
import { SessionService } from "../../../services/session.service";
import { SessionModule } from "../session.module";
import SessionServiceMock from "../../../../__mocks__/services/session.service.mock";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/compiler";

describe('PreviousSessionsComponent_class',  () => {
    let component: PreviousSessionsComponent;
    let fixture: ComponentFixture<PreviousSessionsComponent>;
    const mockSession: Session = {
      id: '1',
      date: '2022-01-01',
      practiceTime: 60,
      whatToPractice: 'scales',
      sessionIntent: 'improve technique',
      postPracticeReflection: 'went well',
      goalForNextTime: 'do even better'
    };

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [SessionModule],
        providers: [
          HttpClient,
          HttpHandler,
          { provide: SessionService, useValue: SessionServiceMock, }],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
      }).compileComponents();
      fixture = TestBed.createComponent(PreviousSessionsComponent);
      component = fixture.componentInstance;
      component.ngOnInit();
      fixture.detectChanges();
    });

    it("retrieves all sessions", () => {
      expect(component.sessionData).toEqual([{
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
        }]);
      expect(SessionServiceMock.getAllSessions$).toHaveBeenCalled();
    });

    it("retrieves one session", () => {
      component.retrieveSessionById('1');
      expect(SessionServiceMock.getSession$).toHaveBeenCalledWith('1');
    });
  });

