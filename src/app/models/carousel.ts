import { Timestamp } from 'firebase/firestore';

/**
 * Attribution information for Creative Commons licensed images
 * Ensures compliance with CC BY and CC BY-SA requirements
 */
export class Attribution {
  title!: string;            // Work title if available
  creatorName!: string;      // Required for CC BY
  creatorUrl?: string;       // Link to creator's profile/page
  sourceName: 'Openverse' = 'Openverse';
  sourceUrl!: string;        // Openverse detail page
  license!: string;          // e.g., "CC BY 4.0" or "CC BY-SA 4.0"
  licenseUrl!: string;       // Link to license text
  changesMade?: string;      // e.g., "Cropped & resized"
  originalFileUrl?: string;  // Direct file URL downloaded from
}

/**
 * Responsive image variants for different screen sizes
 */
export class ImageVariants {
  sm?: string;      // Small size (e.g., 480px)
  md?: string;      // Medium size (e.g., 800px)
  lg?: string;      // Large size (e.g., 1200px)
  webpSm?: string;  // WebP small
  webpMd?: string;  // WebP medium
  webpLg?: string;  // WebP large
}

/**
 * Image information including storage path and responsive variants
 */
export class ImageInfo {
  storagePath?: string;  // Firebase Storage path (e.g., "images/openverse/{id}/original.jpg")
  url!: string;          // Default/fallback URL to display
  width?: number;
  height?: number;
  variants?: ImageVariants;
  blurhash?: string;     // Optional low-res placeholder
}

/**
 * Individual carousel item with image and attribution
 */
export class CarouselItem {
  id?: string;
  position!: number;     // For ordering in the carousel
  alt!: string;          // Accessibility text
  linkTargetUrl?: string; // Optional "learn more" link

  image!: ImageInfo;
  attribution!: Attribution;

  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

/**
 * Carousel configuration
 */
export class Carousel {
  id?: string;
  name!: string;
  slug!: string;         // e.g., "dashboard-hero"
  rotateMs = 5000;       // Rotation interval in milliseconds
  aspectRatio = '16/9';
  isActive = true;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}