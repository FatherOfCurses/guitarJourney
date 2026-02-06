import { ImageVariants } from './imageVariants';

export class ImageInfo {
    storagePath?: string;  // e.g., "images/openverse/abcd/original.jpg"
    url?: string;          // default/fallback URL to display
    width?: number;
    height?: number;
    variants?: ImageVariants;
    blurhash?: string;     // optional low-res placeholder
  }