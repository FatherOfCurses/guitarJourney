import { Injectable, inject } from '@angular/core';
import { 
  Firestore, 
  collection, 
  query, 
  orderBy, 
  getDocs,
  collectionData
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { CarouselItem } from '../models/carousel';
import { carouselItemConverter } from '../features/carousels/carousel.converters';

/**
 * Service for fetching carousel items from Firestore
 */
@Injectable({
  providedIn: 'root'
})
export class CarouselService {
  private firestore = inject(Firestore);

  /**
   * Fetch carousel items for a specific carousel slug
   * @param slug - Carousel identifier (e.g., 'dashboard-hero')
   * @returns Observable of ordered carousel items
   */
  getCarouselItems$(slug: string): Observable<CarouselItem[]> {
    const itemsRef = collection(
      this.firestore, 
      `carousels/${slug}/items`
    ).withConverter(carouselItemConverter);

    const q = query(itemsRef, orderBy('position', 'asc'));

    return collectionData(q, { idField: 'id' }) as Observable<CarouselItem[]>;
  }

  /**
   * Fetch carousel items once (for initial load or manual refresh)
   * @param slug - Carousel identifier
   * @returns Promise of ordered carousel items
   */
  async getCarouselItems(slug: string): Promise<CarouselItem[]> {
    const itemsRef = collection(
      this.firestore, 
      `carousels/${slug}/items`
    ).withConverter(carouselItemConverter);

    const q = query(itemsRef, orderBy('position', 'asc'));
    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => doc.data() as CarouselItem);
  }
}