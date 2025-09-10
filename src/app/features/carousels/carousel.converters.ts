// src/app/models/carousel.converters.ts
import { FirestoreDataConverter } from 'firebase/firestore';
import { CarouselItem } from '@models/carouselItem';
import { ImageInfo } from '@models/imageInfo';
import { ImageVariants } from '@models/imageVariants';
import { Attribution } from '@models/attribution';

export const carouselItemConverter: FirestoreDataConverter<CarouselItem> = {
  toFirestore: (i) => ({
    position: i.position,
    alt: i.alt,
    linkTargetUrl: i.linkTargetUrl ?? null,
    image: {
      storagePath: i.image.storagePath ?? null,
      url: i.image.url ?? null,
      width: i.image.width ?? null,
      height: i.image.height ?? null,
      variants: i.image.variants ? {
        sm: i.image.variants.sm ?? null,
        md: i.image.variants.md ?? null,
        lg: i.image.variants.lg ?? null,
        webpSm: i.image.variants.webpSm ?? null,
        webpMd: i.image.variants.webpMd ?? null,
        webpLg: i.image.variants.webpLg ?? null,
      } : null,
      blurhash: i.image.blurhash ?? null,
    },
    attribution: {
      title: i.attribution.title ?? null,
      creatorName: i.attribution.creatorName,
      creatorUrl: i.attribution.creatorUrl ?? null,
      sourceName: i.attribution.sourceName,   // "Openverse"
      sourceUrl: i.attribution.sourceUrl,
      license: i.attribution.license,
      licenseUrl: i.attribution.licenseUrl,
      changesMade: i.attribution.changesMade ?? null,
      originalFileUrl: i.attribution.originalFileUrl ?? null,
    },
    createdAt: i.createdAt ?? null,
    updatedAt: i.updatedAt ?? null,
  }),
  fromFirestore: (snap) => {
    const d = snap.data() as any;
    const item = new CarouselItem();
    item.id = snap.id;
    item.position = d.position;
    item.alt = d.alt;
    item.linkTargetUrl = d.linkTargetUrl ?? undefined;

    const variants = new ImageVariants();
    if (d.image?.variants) {
      variants.sm = d.image.variants.sm ?? undefined;
      variants.md = d.image.variants.md ?? undefined;
      variants.lg = d.image.variants.lg ?? undefined;
      variants.webpSm = d.image.variants.webpSm ?? undefined;
      variants.webpMd = d.image.variants.webpMd ?? undefined;
      variants.webpLg = d.image.variants.webpLg ?? undefined;
    }

    const image = new ImageInfo();
    image.storagePath = d.image?.storagePath ?? undefined;
    image.url = d.image?.url ?? undefined;
    image.width = d.image?.width ?? undefined;
    image.height = d.image?.height ?? undefined;
    image.variants = (d.image?.variants ? variants : undefined);
    image.blurhash = d.image?.blurhash ?? undefined;

    const attribution = new Attribution();
    attribution.title = d.attribution?.title ?? '';
    attribution.creatorName = d.attribution?.creatorName ?? '';
    attribution.creatorUrl = d.attribution?.creatorUrl ?? undefined;
    attribution.sourceUrl = d.attribution?.sourceUrl ?? '';
    attribution.license = d.attribution?.license ?? '';
    attribution.licenseUrl = d.attribution?.licenseUrl ?? '';
    attribution.changesMade = d.attribution?.changesMade ?? undefined;
    attribution.originalFileUrl = d.attribution?.originalFileUrl ?? undefined;

    item.image = image;
    item.attribution = attribution;
    item.createdAt = d.createdAt ?? undefined;
    item.updatedAt = d.updatedAt ?? undefined;

    return item;
  }
};
