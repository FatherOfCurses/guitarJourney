import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { SongsterrService } from "./songsterr.service";
import { TestBed } from "@angular/core/testing";
import { SongsterrResponse } from "../models/songsterrResponse";

describe('SongsterrService', () => {
  let httpTestingController: HttpTestingController;
  let service: SongsterrService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    httpTestingController = TestBed.get(HttpTestingController);
    service = TestBed.inject(SongsterrService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('getData should return expected data', (done) => {
    const expectedData: SongsterrResponse = {
      artist: {
        id: 1728283,
        name: 'Gourds for Chucking',
        nameWithoutThePrefix: 'Gourds',
        type: 'Metal',
        useThePrefix: false
      },
      chordsPresent: true,
      id: '82738291',
      tabTypes: ['simple','complex'],
      title: 'Chuck It Up',
      type: 'sludge'
    };

    service.getSongById$('82738291').subscribe(actualData => {
      expect(actualData).toEqual(expectedData);
      done();
    });

    const testRequest = httpTestingController.expectOne('http://www.songsterr.com/a/wa/song?id=82738291');
    testRequest.flush(expectedData);
  });

  it('getAll should return multiple records', (done) => {
    const expectedData: SongsterrResponse[] = [{
      artist: {
        id: 1728283,
        name: 'Gourds for Chucking',
        nameWithoutThePrefix: 'Gourds',
        type: 'Metal',
        useThePrefix: false
      },
      chordsPresent: true,
      id: '82738291',
      tabTypes: ['simple','complex'],
      title: 'Chuck It Up',
      type: 'sludge'
    },
      {
        artist: {
          id: 1728283,
          name: 'Gourds for Chucking',
          nameWithoutThePrefix: 'Gourds',
          type: 'Metal',
          useThePrefix: false
        },
        chordsPresent: true,
        id: '333829',
        tabTypes: ['simple','complex'],
        title: 'Punkin',
        type: 'sludge'
      }];
    service.getSearchResults$('Gourds').subscribe(actualData => {
      expect(actualData).toEqual(expectedData);
      done();
    });

    const testRequest = httpTestingController.expectOne('http://www.songsterr.com/a/ra/songs.json?pattern=Gourds');
    testRequest.flush(expectedData);
  });
});
