import { Timestamp } from 'firebase/firestore';

export class Carousel {
    id?: string;
    name!: string;
    slug!: string;         // e.g., "home-hero"
    rotateMs = 5000;
    aspectRatio = '16/9';
    isActive = true;
    createdAt?: Timestamp;
    updatedAt?: Timestamp;
  }