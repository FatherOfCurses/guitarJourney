import { of } from "rxjs";
import { Timestamp } from 'firebase/firestore';
import { Session } from '../../app/models/session';

const session: Session = {
  id: 'id12345',
  ownerUid: 'uid12345',
  date: Timestamp.fromDate(new Date('2021-10-01T00:00:00Z')),
  practiceTime: 45,
  whatToPractice: 'Stairway to Heaven',
  sessionIntent: 'Get acoustic fingerpicking down',
  postPracticeReflection: 'Worked pretty well, was able to play at 90% speed',
  goalForNextTime: 'Fingerpicking at 100%'
};

const sessions: Session[] = [
  {
    id: 'id12345',
    ownerUid: 'uid12345',
    date: Timestamp.fromDate(new Date('2021-10-01T00:00:00Z')),
    practiceTime: 45,
    whatToPractice: 'Stairway to Heaven',
    sessionIntent: 'Get acoustic fingerpicking down',
    postPracticeReflection: 'Worked pretty well, was able to play at 90% speed',
    goalForNextTime: 'Fingerpicking at 100%'
  },
  {
    id: 'id98764',
    ownerUid: 'uid12345',
    date: Timestamp.fromDate(new Date('2021-10-31T00:00:00Z')),
    practiceTime: 20,
    whatToPractice: 'Paradise City',
    sessionIntent: 'Try playing solo all the way through',
    postPracticeReflection: 'Really rough, dont think I made it all the way through',
    goalForNextTime: 'Spend more time warming up before practice'
  }
];

const SessionServiceMock = {
  getSession$: jest.fn(() => of(session)),
  getAllSessions$: jest.fn(() => of(sessions)),
  putSession$: jest.fn(() => of('success'))
}

export default SessionServiceMock;
