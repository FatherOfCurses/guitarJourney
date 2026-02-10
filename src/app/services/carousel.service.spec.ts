// carousel.service.spec.ts — Firestore mocks before imports
jest.mock('@angular/fire/firestore', () => ({
  Firestore: class {},
  collection: jest.fn(),
  collectionData: jest.fn(),
  query: jest.fn(),
  orderBy: jest.fn(),
  getDocs: jest.fn(),
}));

import { TestBed } from '@angular/core/testing';
import { of, firstValueFrom } from 'rxjs';

import * as afs from '@angular/fire/firestore';

import { CarouselService } from './carousel.service';
import { CarouselItem } from '../models/carousel';

function makeItem(position: number): CarouselItem {
  const item = new CarouselItem();
  item.id = `item-${position}`;
  item.position = position;
  item.alt = `Image ${position}`;
  item.image = { url: `/assets/carousel/${position}.jpg` } as any;
  item.attribution = {
    title: `Photo ${position}`,
    creatorName: 'Photographer',
    sourceName: 'Openverse',
    sourceUrl: 'https://openverse.org',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0',
  } as any;
  return item;
}

describe('CarouselService', () => {
  let service: CarouselService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CarouselService,
        { provide: (afs as any).Firestore, useValue: {} },
      ],
    });

    service = TestBed.inject(CarouselService);

    jest.clearAllMocks();

    (afs.collection as jest.Mock).mockImplementation(() => ({
      withConverter: () => ({ __type: 'CollectionRefWithConverter' }),
    }));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // ---------- getCarouselItems$ (Observable) ----------

  it('getCarouselItems$ returns carousel items as an observable', async () => {
    const collectionDataMock = afs.collectionData as jest.Mock;
    const queryMock = afs.query as jest.Mock;
    const orderByMock = afs.orderBy as jest.Mock;

    const fakeQuery = { __type: 'Query' };
    queryMock.mockReturnValue(fakeQuery);
    orderByMock.mockReturnValue({});

    const expected = [makeItem(1), makeItem(2), makeItem(3)];
    collectionDataMock.mockReturnValue(of(expected));

    const out = await firstValueFrom(service.getCarouselItems$('dashboard-hero'));

    expect(out).toEqual(expected);
    expect(out).toHaveLength(3);
    expect(collectionDataMock).toHaveBeenCalledWith(fakeQuery, { idField: 'id' });
  });

  it('getCarouselItems$ builds the correct collection path from slug', async () => {
    const collectionMock = afs.collection as jest.Mock;
    const collectionDataMock = afs.collectionData as jest.Mock;
    const queryMock = afs.query as jest.Mock;
    const orderByMock = afs.orderBy as jest.Mock;

    queryMock.mockReturnValue({});
    orderByMock.mockReturnValue({});
    collectionDataMock.mockReturnValue(of([]));

    await firstValueFrom(service.getCarouselItems$('dashboard-hero'));

    expect(collectionMock).toHaveBeenCalledWith(expect.anything(), 'carousels/dashboard-hero/items');
  });

  it('getCarouselItems$ orders by position ascending', async () => {
    const collectionDataMock = afs.collectionData as jest.Mock;
    const queryMock = afs.query as jest.Mock;
    const orderByMock = afs.orderBy as jest.Mock;

    queryMock.mockReturnValue({});
    orderByMock.mockReturnValue({});
    collectionDataMock.mockReturnValue(of([]));

    await firstValueFrom(service.getCarouselItems$('my-carousel'));

    expect(orderByMock).toHaveBeenCalledWith('position', 'asc');
  });

  it('getCarouselItems$ returns empty array when no items exist', async () => {
    const collectionDataMock = afs.collectionData as jest.Mock;
    const queryMock = afs.query as jest.Mock;
    const orderByMock = afs.orderBy as jest.Mock;

    queryMock.mockReturnValue({});
    orderByMock.mockReturnValue({});
    collectionDataMock.mockReturnValue(of([]));

    const out = await firstValueFrom(service.getCarouselItems$('empty-carousel'));

    expect(out).toEqual([]);
  });

  it('getCarouselItems$ works with different slugs', async () => {
    const collectionMock = afs.collection as jest.Mock;
    const collectionDataMock = afs.collectionData as jest.Mock;
    const queryMock = afs.query as jest.Mock;
    const orderByMock = afs.orderBy as jest.Mock;

    queryMock.mockReturnValue({});
    orderByMock.mockReturnValue({});
    collectionDataMock.mockReturnValue(of([]));

    await firstValueFrom(service.getCarouselItems$('featured-guitars'));

    expect(collectionMock).toHaveBeenCalledWith(
      expect.anything(),
      'carousels/featured-guitars/items'
    );
  });

  // ---------- getCarouselItems (Promise) ----------

  it('getCarouselItems returns carousel items as a promise', async () => {
    const getDocsMock = afs.getDocs as jest.Mock;
    const queryMock = afs.query as jest.Mock;
    const orderByMock = afs.orderBy as jest.Mock;

    queryMock.mockReturnValue({});
    orderByMock.mockReturnValue({});

    const item1 = makeItem(1);
    const item2 = makeItem(2);
    getDocsMock.mockResolvedValue({
      docs: [
        { data: () => item1 },
        { data: () => item2 },
      ],
    });

    const out = await service.getCarouselItems('dashboard-hero');

    expect(out).toEqual([item1, item2]);
    expect(out).toHaveLength(2);
  });

  it('getCarouselItems builds the correct collection path from slug', async () => {
    const collectionMock = afs.collection as jest.Mock;
    const getDocsMock = afs.getDocs as jest.Mock;
    const queryMock = afs.query as jest.Mock;
    const orderByMock = afs.orderBy as jest.Mock;

    queryMock.mockReturnValue({});
    orderByMock.mockReturnValue({});
    getDocsMock.mockResolvedValue({ docs: [] });

    await service.getCarouselItems('homepage-banner');

    expect(collectionMock).toHaveBeenCalledWith(
      expect.anything(),
      'carousels/homepage-banner/items'
    );
  });

  it('getCarouselItems orders by position ascending', async () => {
    const getDocsMock = afs.getDocs as jest.Mock;
    const queryMock = afs.query as jest.Mock;
    const orderByMock = afs.orderBy as jest.Mock;

    queryMock.mockReturnValue({});
    orderByMock.mockReturnValue({});
    getDocsMock.mockResolvedValue({ docs: [] });

    await service.getCarouselItems('any-slug');

    expect(orderByMock).toHaveBeenCalledWith('position', 'asc');
  });

  it('getCarouselItems returns empty array when no documents exist', async () => {
    const getDocsMock = afs.getDocs as jest.Mock;
    const queryMock = afs.query as jest.Mock;
    const orderByMock = afs.orderBy as jest.Mock;

    queryMock.mockReturnValue({});
    orderByMock.mockReturnValue({});
    getDocsMock.mockResolvedValue({ docs: [] });

    const out = await service.getCarouselItems('empty-carousel');

    expect(out).toEqual([]);
  });

  it('getCarouselItems maps each doc via doc.data()', async () => {
    const getDocsMock = afs.getDocs as jest.Mock;
    const queryMock = afs.query as jest.Mock;
    const orderByMock = afs.orderBy as jest.Mock;

    queryMock.mockReturnValue({});
    orderByMock.mockReturnValue({});

    const dataFn1 = jest.fn().mockReturnValue(makeItem(1));
    const dataFn2 = jest.fn().mockReturnValue(makeItem(2));
    const dataFn3 = jest.fn().mockReturnValue(makeItem(3));

    getDocsMock.mockResolvedValue({
      docs: [
        { data: dataFn1 },
        { data: dataFn2 },
        { data: dataFn3 },
      ],
    });

    const out = await service.getCarouselItems('test');

    expect(out).toHaveLength(3);
    expect(dataFn1).toHaveBeenCalled();
    expect(dataFn2).toHaveBeenCalled();
    expect(dataFn3).toHaveBeenCalled();
  });
});
