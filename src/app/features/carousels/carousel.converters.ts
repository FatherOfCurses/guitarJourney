import { 
  DocumentData, 
  FirestoreDataConverter, 
  QueryDocumentSnapshot, 
  SnapshotOptions,
  Timestamp 
} from 'firebase/firestore';
import { 
  Attribution, 
  Carousel, 
  CarouselItem, 
  ImageInfo, 
  ImageVariants 
} from '../../models/carousel';

/**
 * Firestore converter for CarouselItem
 * Provides type-safe reading and writing of carousel items
 */
export const carouselItemConverter: FirestoreDataConverter<CarouselItem> = {
  toFirestore: (item: CarouselItem): DocumentData => ({
    position: item.position,
    alt: item.alt,
    linkTargetUrl: item.linkTargetUrl ?? null,
    image: {
      storagePath: item.image.storagePath ?? null,
      url: item.image.url,
      width: item.image.width ?? null,
      height: item.image.height ?? null,
      variants: item.image.variants ? {
        sm: item.image.variants.sm ?? null,
        md: item.image.variants.md ?? null,
        lg: item.image.variants.lg ?? null,
        webpSm: item.image.variants.webpSm ?? null,
        webpMd: item.image.variants.webpMd ?? null,
        webpLg: item.image.variants.webpLg ?? null,
      } : null,
      blurhash: item.image.blurhash ?? null,
    },
    attribution: {
      title: item.attribution.title,
      creatorName: item.attribution.creatorName,
      creatorUrl: item.attribution.creatorUrl ?? null,
      sourceName: item.attribution.sourceName,
      sourceUrl: item.attribution.sourceUrl,
      license: item.attribution.license,
      licenseUrl: item.attribution.licenseUrl,
      changesMade: item.attribution.changesMade ?? null,
      originalFileUrl: item.attribution.originalFileUrl ?? null,
    },
    createdAt: item.createdAt ?? null,
    updatedAt: item.updatedAt ?? null,
  }),

  fromFirestore: (
    snap: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): CarouselItem => {
    const data = snap.data(options);
    
    const item = new CarouselItem();
    item.id = snap.id;
    item.position = data['position'];
    item.alt = data['alt'];
    item.linkTargetUrl = data['linkTargetUrl'] ?? undefined;

    // Reconstruct ImageVariants if present
    const variants = new ImageVariants();
    if (data['image']?.['variants']) {
      variants.sm = data['image']['variants']['sm'] ?? undefined;
      variants.md = data['image']['variants']['md'] ?? undefined;
      variants.lg = data['image']['variants']['lg'] ?? undefined;
      variants.webpSm = data['image']['variants']['webpSm'] ?? undefined;
      variants.webpMd = data['image']['variants']['webpMd'] ?? undefined;
      variants.webpLg = data['image']['variants']['webpLg'] ?? undefined;
    }

    // Reconstruct ImageInfo
    const image = new ImageInfo();
    image.storagePath = data['image']?.['storagePath'] ?? undefined;
    image.url = data['image']?.['url'] ?? '';
    image.width = data['image']?.['width'] ?? undefined;
    image.height = data['image']?.['height'] ?? undefined;
    image.variants = data['image']?.['variants'] ? variants : undefined;
    image.blurhash = data['image']?.['blurhash'] ?? undefined;

    // Reconstruct Attribution
    const attribution = new Attribution();
    attribution.title = data['attribution']?.['title'] ?? '';
    attribution.creatorName = data['attribution']?.['creatorName'] ?? '';
    attribution.creatorUrl = data['attribution']?.['creatorUrl'] ?? undefined;
    attribution.sourceUrl = data['attribution']?.['sourceUrl'] ?? '';
    attribution.license = data['attribution']?.['license'] ?? '';
    attribution.licenseUrl = data['attribution']?.['licenseUrl'] ?? '';
    attribution.changesMade = data['attribution']?.['changesMade'] ?? undefined;
    attribution.originalFileUrl = data['attribution']?.['originalFileUrl'] ?? undefined;

    item.image = image;
    item.attribution = attribution;
    item.createdAt = data['createdAt'] ?? undefined;
    item.updatedAt = data['updatedAt'] ?? undefined;

    return item;
  }
};

/**
 * Firestore converter for Carousel
 * Provides type-safe reading and writing of carousel configuration
 */
export const carouselConverter: FirestoreDataConverter<Carousel> = {
  toFirestore: (carousel: Carousel): DocumentData => ({
    name: carousel.name,
    slug: carousel.slug,
    rotateMs: carousel.rotateMs,
    aspectRatio: carousel.aspectRatio,
    isActive: carousel.isActive,
    createdAt: carousel.createdAt ?? null,
    updatedAt: carousel.updatedAt ?? null,
  }),

  fromFirestore: (
    snap: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Carousel => {
    const data = snap.data(options);
    
    const carousel = new Carousel();
    carousel.id = snap.id;
    carousel.name = data['name'];
    carousel.slug = data['slug'];
    carousel.rotateMs = data['rotateMs'] ?? 5000;
    carousel.aspectRatio = data['aspectRatio'] ?? '16/9';
    carousel.isActive = data['isActive'] ?? true;
    carousel.createdAt = data['createdAt'] ?? undefined;
    carousel.updatedAt = data['updatedAt'] ?? undefined;

    return carousel;
  }
};