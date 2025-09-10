import { Timestamp } from 'firebase/firestore';
import { ImageInfo } from './imageInfo';
import { Attribution } from './attribution';


export class CarouselItem {
    id?: string;
    position!: number;     // for ordering in the carousel
    alt!: string;          // accessibility text
    linkTargetUrl?: string;
  
    image!: ImageInfo;
    attribution!: Attribution;
  
    // Timestamps are handy if you manage items in an admin UI
    createdAt?: Timestamp;
    updatedAt?: Timestamp;
  }