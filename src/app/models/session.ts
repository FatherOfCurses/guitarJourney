import { Timestamp } from 'firebase/firestore';

export class Session {
  id?: string;
  ownerUid: string;
  date: Timestamp;
  practiceTime: number;
  whatToPractice: string;
  sessionIntent: string;
  postPracticeReflection: string;
  goalForNextTime: string;
}
