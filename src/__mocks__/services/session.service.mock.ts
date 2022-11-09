import { of } from "rxjs";
import { Session } from '../../app/models/session';

const session = {
  id: 'id12345',
  date: '10/01/2021',
  practiceTime: 45,
  whatToPractice: 'Stairway to Heaven',
  sessionIntent: 'Get acoustic fingerpicking down',
  postPracticeReflection: 'Worked pretty well, was able to play at 90% speed',
  goalForNextTime: 'Fingerpicking at 100%'
};

const sessions =[
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

const SessionServiceMock = {
  // BASE_URL: 'https://some.url',
  getSession: jest.fn(() => of(session as Session)),
  getAllSessions: jest.fn(() => of(sessions as Array<Session>)),
  putSession: jest.fn(() => of("12345" as String))
}

export default SessionServiceMock;
