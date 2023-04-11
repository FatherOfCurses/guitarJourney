import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SongComponent } from './song.component';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { SongsterrService } from '../../services/songsterr.service';
import { MessageService } from "primeng/api";
import { Observable } from "rxjs";

describe('SongComponent', () => {
  let songComponent: SongComponent;
  let songsterrService: {
    getSearchResults$: jest.Mock<any, any>;
    getSongById$: jest.Mock<any, any>;
  };
  let messageService: { add: jest.Mock<any, any> };
  let messageServiceSpy: jest.SpyInstance;
  let fixture: ComponentFixture<SongComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SongComponent ],
      providers: [HttpClient, HttpHandler, SongsterrService, MessageService]
    }).compileComponents();
    songsterrService = {
      getSongById$: jest.fn(),
      getSearchResults$: jest.fn()
    }
    messageServiceSpy = jest.spyOn(messageService, 'add');
    fixture = TestBed.createComponent(SongComponent);
    songComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(songComponent).toBeTruthy();
  });

  describe('Songsterr searches', () => {
    it('should get songs', () => {
      const expectedResults = [{ artist: { name: "Bob Marley" }, chordsPresent: true, id: "123", tabTypes: ["guitar"], title: "No Woman No Cry", type: "tab" }];
      songComponent.getSongs((results) => {
        expect(results).toEqual(expectedResults);
      });
    });
    it('should log a get result', () => {
      const consoleSpy = jest.spyOn(console, 'log');
      songsterrService.getSearchResults$('Marley').subscribe(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Response:', expect.any(Array));
      });
    });
    it("successfully returns a song id", () => {
      const songId = '123';
      songsterrService.getSongById$(songId).subscribe((result) => {
        expect(result).toEqual(expect.any(String));
      });
    });
    it("successfully returns a search result", () => {
      songComponent.ngOnInit();
      expect(songComponent.searchResult$).toEqual(expect.any(Observable));
    });
  });

  describe('Upload dialog', () => {
    it('successfully fires upload event', () => {
      const event = { file: { name: 'testFile.txt' } };
      songComponent.onUpload(event);
      expect(messageServiceSpy).toHaveBeenCalled();
    });
  });

  //TODO: Test coverage on lines 17-31

});
