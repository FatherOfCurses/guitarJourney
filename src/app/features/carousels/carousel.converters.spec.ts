import { Timestamp } from 'firebase/firestore';
import {
  Attribution,
  Carousel,
  CarouselItem,
  ImageInfo,
  ImageVariants,
} from '../../models/carousel';
import { carouselConverter, carouselItemConverter } from './carousel.converters';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Build a minimal QueryDocumentSnapshot mock. */
function makeSnap(id: string, snapshotData: Record<string, unknown>) {
  return {
    id,
    data: (_opts?: unknown) => ({ ...snapshotData }),
  } as any;
}

/** A real Timestamp so instanceof checks (if any) still pass. */
const ts1 = Timestamp.fromDate(new Date('2024-01-15T10:00:00Z'));
const ts2 = Timestamp.fromDate(new Date('2024-06-20T14:30:00Z'));

// ---------------------------------------------------------------------------
// carouselItemConverter
// ---------------------------------------------------------------------------

describe('carouselItemConverter', () => {
  // -------------------------------------------------------------------------
  // toFirestore
  // -------------------------------------------------------------------------

  describe('toFirestore', () => {
    it('serializes a fully-populated CarouselItem correctly', () => {
      const item = new CarouselItem();
      item.position = 1;
      item.alt = 'A beautiful guitar';
      item.linkTargetUrl = 'https://example.com/guitars';

      const variants = new ImageVariants();
      variants.sm = 'https://cdn.example.com/sm.jpg';
      variants.md = 'https://cdn.example.com/md.jpg';
      variants.lg = 'https://cdn.example.com/lg.jpg';
      variants.webpSm = 'https://cdn.example.com/sm.webp';
      variants.webpMd = 'https://cdn.example.com/md.webp';
      variants.webpLg = 'https://cdn.example.com/lg.webp';

      const image = new ImageInfo();
      image.storagePath = 'images/openverse/abc123/original.jpg';
      image.url = 'https://cdn.example.com/original.jpg';
      image.width = 1920;
      image.height = 1080;
      image.variants = variants;
      image.blurhash = 'LKO2?U%2Tw=w]~RBVZRi};RPxuwH';

      const attribution = new Attribution();
      attribution.title = 'Electric Guitar';
      attribution.creatorName = 'John Doe';
      attribution.creatorUrl = 'https://example.com/johndoe';
      attribution.sourceUrl = 'https://openverse.org/image/abc123';
      attribution.license = 'CC BY 4.0';
      attribution.licenseUrl = 'https://creativecommons.org/licenses/by/4.0';
      attribution.changesMade = 'Cropped & resized';
      attribution.originalFileUrl = 'https://original.example.com/guitar.jpg';

      item.image = image;
      item.attribution = attribution;
      item.createdAt = ts1;
      item.updatedAt = ts2;

      const doc = carouselItemConverter.toFirestore(item);

      expect(doc['position']).toBe(1);
      expect(doc['alt']).toBe('A beautiful guitar');
      expect(doc['linkTargetUrl']).toBe('https://example.com/guitars');

      expect(doc['image']).toEqual({
        storagePath: 'images/openverse/abc123/original.jpg',
        url: 'https://cdn.example.com/original.jpg',
        width: 1920,
        height: 1080,
        variants: {
          sm: 'https://cdn.example.com/sm.jpg',
          md: 'https://cdn.example.com/md.jpg',
          lg: 'https://cdn.example.com/lg.jpg',
          webpSm: 'https://cdn.example.com/sm.webp',
          webpMd: 'https://cdn.example.com/md.webp',
          webpLg: 'https://cdn.example.com/lg.webp',
        },
        blurhash: 'LKO2?U%2Tw=w]~RBVZRi};RPxuwH',
      });

      expect(doc['attribution']).toEqual({
        title: 'Electric Guitar',
        creatorName: 'John Doe',
        creatorUrl: 'https://example.com/johndoe',
        sourceName: 'Openverse',
        sourceUrl: 'https://openverse.org/image/abc123',
        license: 'CC BY 4.0',
        licenseUrl: 'https://creativecommons.org/licenses/by/4.0',
        changesMade: 'Cropped & resized',
        originalFileUrl: 'https://original.example.com/guitar.jpg',
      });

      expect(doc['createdAt']).toBe(ts1);
      expect(doc['updatedAt']).toBe(ts2);
    });

    it('maps all optional fields to null when they are undefined', () => {
      const item = new CarouselItem();
      item.position = 0;
      item.alt = 'Minimal item';
      // linkTargetUrl omitted → null

      const image = new ImageInfo();
      image.url = 'https://cdn.example.com/fallback.jpg';
      // storagePath, width, height, variants, blurhash all omitted → null

      const attribution = new Attribution();
      attribution.title = 'Minimal Photo';
      attribution.creatorName = 'Jane Smith';
      // creatorUrl omitted → null
      attribution.sourceUrl = 'https://openverse.org/image/xyz';
      attribution.license = 'CC BY-SA 4.0';
      attribution.licenseUrl = 'https://creativecommons.org/licenses/by-sa/4.0';
      // changesMade omitted → null
      // originalFileUrl omitted → null

      item.image = image;
      item.attribution = attribution;
      // createdAt, updatedAt omitted → null

      const doc = carouselItemConverter.toFirestore(item);

      expect(doc['linkTargetUrl']).toBeNull();

      expect(doc['image']['storagePath']).toBeNull();
      expect(doc['image']['width']).toBeNull();
      expect(doc['image']['height']).toBeNull();
      expect(doc['image']['variants']).toBeNull();
      expect(doc['image']['blurhash']).toBeNull();

      expect(doc['attribution']['creatorUrl']).toBeNull();
      expect(doc['attribution']['changesMade']).toBeNull();
      expect(doc['attribution']['originalFileUrl']).toBeNull();

      expect(doc['createdAt']).toBeNull();
      expect(doc['updatedAt']).toBeNull();
    });

    it('serializes image.variants with some variant URLs undefined → null', () => {
      // Exercise the per-variant ?? null branches inside the variants object.
      const item = new CarouselItem();
      item.position = 2;
      item.alt = 'Partial variants';

      const variants = new ImageVariants();
      variants.sm = 'https://cdn.example.com/sm.jpg';
      // md, lg, webpSm, webpMd, webpLg all undefined → null

      const image = new ImageInfo();
      image.url = 'https://cdn.example.com/fallback.jpg';
      image.variants = variants;

      const attribution = new Attribution();
      attribution.title = 'Photo';
      attribution.creatorName = 'Author';
      attribution.sourceUrl = 'https://openverse.org/image/1';
      attribution.license = 'CC BY 4.0';
      attribution.licenseUrl = 'https://creativecommons.org/licenses/by/4.0';

      item.image = image;
      item.attribution = attribution;

      const doc = carouselItemConverter.toFirestore(item);

      expect(doc['image']['variants']).toEqual({
        sm: 'https://cdn.example.com/sm.jpg',
        md: null,
        lg: null,
        webpSm: null,
        webpMd: null,
        webpLg: null,
      });
    });
  });

  // -------------------------------------------------------------------------
  // fromFirestore
  // -------------------------------------------------------------------------

  describe('fromFirestore', () => {
    it('reconstructs a fully-populated CarouselItem from snapshot data', () => {
      const snapshotData = {
        position: 3,
        alt: 'Acoustic guitar on stage',
        linkTargetUrl: 'https://example.com/stage',
        image: {
          storagePath: 'images/openverse/stage/original.jpg',
          url: 'https://cdn.example.com/stage.jpg',
          width: 1280,
          height: 720,
          variants: {
            sm: 'https://cdn.example.com/stage-sm.jpg',
            md: 'https://cdn.example.com/stage-md.jpg',
            lg: 'https://cdn.example.com/stage-lg.jpg',
            webpSm: 'https://cdn.example.com/stage-sm.webp',
            webpMd: 'https://cdn.example.com/stage-md.webp',
            webpLg: 'https://cdn.example.com/stage-lg.webp',
          },
          blurhash: 'LHBzxst7IUM{~qj[j[az',
        },
        attribution: {
          title: 'On Stage',
          creatorName: 'Alice',
          creatorUrl: 'https://example.com/alice',
          sourceName: 'Openverse',
          sourceUrl: 'https://openverse.org/image/stage',
          license: 'CC BY 2.0',
          licenseUrl: 'https://creativecommons.org/licenses/by/2.0',
          changesMade: 'Cropped',
          originalFileUrl: 'https://original.example.com/stage.jpg',
        },
        createdAt: ts1,
        updatedAt: ts2,
      };

      const snap = makeSnap('item-abc', snapshotData);
      const result = carouselItemConverter.fromFirestore(snap, {});

      expect(result).toBeInstanceOf(CarouselItem);
      expect(result.id).toBe('item-abc');
      expect(result.position).toBe(3);
      expect(result.alt).toBe('Acoustic guitar on stage');
      expect(result.linkTargetUrl).toBe('https://example.com/stage');

      expect(result.image).toBeInstanceOf(ImageInfo);
      expect(result.image.storagePath).toBe('images/openverse/stage/original.jpg');
      expect(result.image.url).toBe('https://cdn.example.com/stage.jpg');
      expect(result.image.width).toBe(1280);
      expect(result.image.height).toBe(720);
      expect(result.image.blurhash).toBe('LHBzxst7IUM{~qj[j[az');

      expect(result.image.variants).toBeInstanceOf(ImageVariants);
      expect(result.image.variants!.sm).toBe('https://cdn.example.com/stage-sm.jpg');
      expect(result.image.variants!.md).toBe('https://cdn.example.com/stage-md.jpg');
      expect(result.image.variants!.lg).toBe('https://cdn.example.com/stage-lg.jpg');
      expect(result.image.variants!.webpSm).toBe('https://cdn.example.com/stage-sm.webp');
      expect(result.image.variants!.webpMd).toBe('https://cdn.example.com/stage-md.webp');
      expect(result.image.variants!.webpLg).toBe('https://cdn.example.com/stage-lg.webp');

      expect(result.attribution).toBeInstanceOf(Attribution);
      expect(result.attribution.title).toBe('On Stage');
      expect(result.attribution.creatorName).toBe('Alice');
      expect(result.attribution.creatorUrl).toBe('https://example.com/alice');
      expect(result.attribution.sourceName).toBe('Openverse');
      expect(result.attribution.sourceUrl).toBe('https://openverse.org/image/stage');
      expect(result.attribution.license).toBe('CC BY 2.0');
      expect(result.attribution.licenseUrl).toBe('https://creativecommons.org/licenses/by/2.0');
      expect(result.attribution.changesMade).toBe('Cropped');
      expect(result.attribution.originalFileUrl).toBe('https://original.example.com/stage.jpg');

      expect(result.createdAt).toBe(ts1);
      expect(result.updatedAt).toBe(ts2);
    });

    it('falls back to undefined for all optional fields when they are absent from data', () => {
      const snapshotData = {
        position: 0,
        alt: 'Sparse item',
        // linkTargetUrl absent → undefined
        image: {
          // storagePath absent → undefined
          url: 'https://cdn.example.com/fallback.jpg',
          // width, height, variants, blurhash absent → undefined
        },
        attribution: {
          title: 'Minimal',
          creatorName: 'Bob',
          // creatorUrl absent → undefined
          sourceUrl: 'https://openverse.org/image/minimal',
          license: 'CC BY 4.0',
          licenseUrl: 'https://creativecommons.org/licenses/by/4.0',
          // changesMade, originalFileUrl absent → undefined
        },
        // createdAt, updatedAt absent → undefined
      };

      const snap = makeSnap('item-sparse', snapshotData);
      const result = carouselItemConverter.fromFirestore(snap, {});

      expect(result.linkTargetUrl).toBeUndefined();
      expect(result.image.storagePath).toBeUndefined();
      expect(result.image.width).toBeUndefined();
      expect(result.image.height).toBeUndefined();
      expect(result.image.variants).toBeUndefined();
      expect(result.image.blurhash).toBeUndefined();
      expect(result.attribution.creatorUrl).toBeUndefined();
      expect(result.attribution.changesMade).toBeUndefined();
      expect(result.attribution.originalFileUrl).toBeUndefined();
      expect(result.createdAt).toBeUndefined();
      expect(result.updatedAt).toBeUndefined();
    });

    it('falls back to undefined for optional fields when they are explicitly null in Firestore', () => {
      // Firestore stores null for optional fields that were absent at write time.
      // The ?? undefined branch should convert null → undefined.
      const snapshotData = {
        position: 1,
        alt: 'Null fields item',
        linkTargetUrl: null,
        image: {
          storagePath: null,
          url: 'https://cdn.example.com/img.jpg',
          width: null,
          height: null,
          variants: null,
          blurhash: null,
        },
        attribution: {
          title: 'Photo',
          creatorName: 'Carol',
          creatorUrl: null,
          sourceUrl: 'https://openverse.org/image/n',
          license: 'CC BY-SA 4.0',
          licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
          changesMade: null,
          originalFileUrl: null,
        },
        createdAt: null,
        updatedAt: null,
      };

      const snap = makeSnap('item-nulls', snapshotData);
      const result = carouselItemConverter.fromFirestore(snap, {});

      expect(result.linkTargetUrl).toBeUndefined();
      expect(result.image.storagePath).toBeUndefined();
      expect(result.image.width).toBeUndefined();
      expect(result.image.height).toBeUndefined();
      expect(result.image.variants).toBeUndefined();
      expect(result.image.blurhash).toBeUndefined();
      expect(result.attribution.creatorUrl).toBeUndefined();
      expect(result.attribution.changesMade).toBeUndefined();
      expect(result.attribution.originalFileUrl).toBeUndefined();
      expect(result.createdAt).toBeUndefined();
      expect(result.updatedAt).toBeUndefined();
    });

    it('falls back to empty strings when attribution fields are absent', () => {
      const snapshotData = {
        position: 2,
        alt: 'Empty strings',
        image: { url: 'https://cdn.example.com/x.jpg' },
        // attribution key itself absent → all ?. chains resolve to undefined → ''
      };

      const snap = makeSnap('item-no-attr', snapshotData);
      const result = carouselItemConverter.fromFirestore(snap, {});

      expect(result.attribution.title).toBe('');
      expect(result.attribution.creatorName).toBe('');
      expect(result.attribution.sourceUrl).toBe('');
      expect(result.attribution.license).toBe('');
      expect(result.attribution.licenseUrl).toBe('');
    });

    it('falls back to empty string for image.url when image key is absent', () => {
      const snapshotData = {
        position: 5,
        alt: 'No image key',
        // image key entirely absent → url defaults to ''
      };

      const snap = makeSnap('item-no-image', snapshotData);
      const result = carouselItemConverter.fromFirestore(snap, {});

      expect(result.image.url).toBe('');
    });

    it('populates only the present variant URLs and leaves the rest undefined', () => {
      const snapshotData = {
        position: 4,
        alt: 'Partial variants item',
        image: {
          url: 'https://cdn.example.com/partial.jpg',
          variants: {
            sm: 'https://cdn.example.com/partial-sm.jpg',
            md: null,   // null → undefined
            lg: null,   // null → undefined
            webpSm: 'https://cdn.example.com/partial-sm.webp',
            webpMd: null,
            webpLg: null,
          },
        },
        attribution: {
          title: 'Partial',
          creatorName: 'Dave',
          sourceUrl: 'https://openverse.org/image/partial',
          license: 'CC BY 4.0',
          licenseUrl: 'https://creativecommons.org/licenses/by/4.0',
        },
      };

      const snap = makeSnap('item-partial', snapshotData);
      const result = carouselItemConverter.fromFirestore(snap, {});

      expect(result.image.variants).toBeInstanceOf(ImageVariants);
      expect(result.image.variants!.sm).toBe('https://cdn.example.com/partial-sm.jpg');
      expect(result.image.variants!.md).toBeUndefined();
      expect(result.image.variants!.lg).toBeUndefined();
      expect(result.image.variants!.webpSm).toBe('https://cdn.example.com/partial-sm.webp');
      expect(result.image.variants!.webpMd).toBeUndefined();
      expect(result.image.variants!.webpLg).toBeUndefined();
    });

    it('passes SnapshotOptions to snap.data()', () => {
      const dataFn = jest.fn().mockReturnValue({
        position: 0,
        alt: 'opts test',
        image: { url: 'https://cdn.example.com/opts.jpg' },
      });
      const snap = { id: 'opts-snap', data: dataFn } as any;
      const opts = { serverTimestamps: 'estimate' as const };

      carouselItemConverter.fromFirestore(snap, opts);

      expect(dataFn).toHaveBeenCalledWith(opts);
    });
  });
});

// ---------------------------------------------------------------------------
// carouselConverter
// ---------------------------------------------------------------------------

describe('carouselConverter', () => {
  // -------------------------------------------------------------------------
  // toFirestore
  // -------------------------------------------------------------------------

  describe('toFirestore', () => {
    it('serializes a fully-populated Carousel correctly', () => {
      const carousel = new Carousel();
      carousel.name = 'Dashboard Hero';
      carousel.slug = 'dashboard-hero';
      carousel.rotateMs = 7000;
      carousel.aspectRatio = '4/3';
      carousel.isActive = true;
      carousel.createdAt = ts1;
      carousel.updatedAt = ts2;

      const doc = carouselConverter.toFirestore(carousel);

      expect(doc).toEqual({
        name: 'Dashboard Hero',
        slug: 'dashboard-hero',
        rotateMs: 7000,
        aspectRatio: '4/3',
        isActive: true,
        createdAt: ts1,
        updatedAt: ts2,
      });
    });

    it('maps createdAt and updatedAt to null when they are undefined', () => {
      const carousel = new Carousel();
      carousel.name = 'Featured Guitars';
      carousel.slug = 'featured-guitars';
      // createdAt, updatedAt omitted → null

      const doc = carouselConverter.toFirestore(carousel);

      expect(doc['createdAt']).toBeNull();
      expect(doc['updatedAt']).toBeNull();
    });

    it('serializes isActive=false correctly', () => {
      const carousel = new Carousel();
      carousel.name = 'Inactive Carousel';
      carousel.slug = 'inactive';
      carousel.isActive = false;

      const doc = carouselConverter.toFirestore(carousel);

      expect(doc['isActive']).toBe(false);
    });
  });

  // -------------------------------------------------------------------------
  // fromFirestore
  // -------------------------------------------------------------------------

  describe('fromFirestore', () => {
    it('reconstructs a fully-populated Carousel from snapshot data', () => {
      const snapshotData = {
        name: 'Homepage Banner',
        slug: 'homepage-banner',
        rotateMs: 8000,
        aspectRatio: '21/9',
        isActive: false,
        createdAt: ts1,
        updatedAt: ts2,
      };

      const snap = makeSnap('carousel-xyz', snapshotData);
      const result = carouselConverter.fromFirestore(snap, {});

      expect(result).toBeInstanceOf(Carousel);
      expect(result.id).toBe('carousel-xyz');
      expect(result.name).toBe('Homepage Banner');
      expect(result.slug).toBe('homepage-banner');
      expect(result.rotateMs).toBe(8000);
      expect(result.aspectRatio).toBe('21/9');
      expect(result.isActive).toBe(false);
      expect(result.createdAt).toBe(ts1);
      expect(result.updatedAt).toBe(ts2);
    });

    it('defaults rotateMs to 5000 when absent from data', () => {
      const snapshotData = {
        name: 'Default Rotate',
        slug: 'default-rotate',
        aspectRatio: '16/9',
        isActive: true,
      };

      const snap = makeSnap('carousel-rotate', snapshotData);
      const result = carouselConverter.fromFirestore(snap, {});

      expect(result.rotateMs).toBe(5000);
    });

    it('defaults rotateMs to 5000 when explicitly null in Firestore', () => {
      const snapshotData = {
        name: 'Null Rotate',
        slug: 'null-rotate',
        rotateMs: null,
        aspectRatio: '16/9',
        isActive: true,
      };

      const snap = makeSnap('carousel-null-rotate', snapshotData);
      const result = carouselConverter.fromFirestore(snap, {});

      expect(result.rotateMs).toBe(5000);
    });

    it('defaults aspectRatio to "16/9" when absent from data', () => {
      const snapshotData = {
        name: 'Default Ratio',
        slug: 'default-ratio',
        rotateMs: 5000,
        isActive: true,
      };

      const snap = makeSnap('carousel-ratio', snapshotData);
      const result = carouselConverter.fromFirestore(snap, {});

      expect(result.aspectRatio).toBe('16/9');
    });

    it('defaults aspectRatio to "16/9" when explicitly null in Firestore', () => {
      const snapshotData = {
        name: 'Null Ratio',
        slug: 'null-ratio',
        rotateMs: 3000,
        aspectRatio: null,
        isActive: true,
      };

      const snap = makeSnap('carousel-null-ratio', snapshotData);
      const result = carouselConverter.fromFirestore(snap, {});

      expect(result.aspectRatio).toBe('16/9');
    });

    it('defaults isActive to true when absent from data', () => {
      const snapshotData = {
        name: 'Default Active',
        slug: 'default-active',
        rotateMs: 5000,
        aspectRatio: '16/9',
      };

      const snap = makeSnap('carousel-active', snapshotData);
      const result = carouselConverter.fromFirestore(snap, {});

      expect(result.isActive).toBe(true);
    });

    it('defaults isActive to true when explicitly null in Firestore', () => {
      const snapshotData = {
        name: 'Null Active',
        slug: 'null-active',
        rotateMs: 5000,
        aspectRatio: '16/9',
        isActive: null,
      };

      const snap = makeSnap('carousel-null-active', snapshotData);
      const result = carouselConverter.fromFirestore(snap, {});

      expect(result.isActive).toBe(true);
    });

    it('falls back to undefined for createdAt and updatedAt when absent', () => {
      const snapshotData = {
        name: 'No Timestamps',
        slug: 'no-timestamps',
        rotateMs: 5000,
        aspectRatio: '16/9',
        isActive: true,
        // createdAt, updatedAt absent → undefined
      };

      const snap = makeSnap('carousel-no-ts', snapshotData);
      const result = carouselConverter.fromFirestore(snap, {});

      expect(result.createdAt).toBeUndefined();
      expect(result.updatedAt).toBeUndefined();
    });

    it('falls back to undefined for createdAt and updatedAt when explicitly null', () => {
      const snapshotData = {
        name: 'Null Timestamps',
        slug: 'null-timestamps',
        rotateMs: 5000,
        aspectRatio: '16/9',
        isActive: true,
        createdAt: null,
        updatedAt: null,
      };

      const snap = makeSnap('carousel-null-ts', snapshotData);
      const result = carouselConverter.fromFirestore(snap, {});

      expect(result.createdAt).toBeUndefined();
      expect(result.updatedAt).toBeUndefined();
    });

    it('passes SnapshotOptions to snap.data()', () => {
      const dataFn = jest.fn().mockReturnValue({
        name: 'Opts Carousel',
        slug: 'opts-carousel',
        rotateMs: 5000,
        aspectRatio: '16/9',
        isActive: true,
      });
      const snap = { id: 'carousel-opts', data: dataFn } as any;
      const opts = { serverTimestamps: 'none' as const };

      carouselConverter.fromFirestore(snap, opts);

      expect(dataFn).toHaveBeenCalledWith(opts);
    });
  });
});
