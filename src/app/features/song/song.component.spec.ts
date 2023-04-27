import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SongComponent } from './song.component';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { SongsterrService } from '../../services/songsterr.service';
import { MessageService } from "primeng/api";
import { Observable } from "rxjs";
import SongsterrServiceMock from "../../../__mocks__/services/songsterr.service.mock";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

describe('SongComponent', () => {
  let component: SongComponent;
  let fixture: ComponentFixture<SongComponent>;
  let messageService: { add: jest.Mock<any, any> };
  let messageServiceSpy: jest.SpyInstance;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[SongComponent],
      providers: [
        HttpClient,
        HttpHandler,
        { provide: SongsterrService, useValue: SongsterrServiceMock },
        { provide: MessageService, useValue: messageServiceSpy }
    ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
    messageServiceSpy = jest.spyOn(messageService, 'add');
    fixture = TestBed.createComponent(SongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Songsterr searches', () => {
    it('should get songs', () => {
      component.getSongs('callback');
      expect(SongsterrServiceMock.getSongById$).toHaveBeenCalled();
    });

    it("successfully returns a song id", () => {
      const songId = '123';
      component.
      });
    });

    it("successfully returns a search result", () => {
      component.ngOnInit();
      expect(component.searchResult$).toEqual(expect.any(Observable));
    });
  });

  describe('Upload dialog', () => {
    it('successfully fires upload event', () => {
      const event = { file: { name: 'testFile.txt' } };
      component.onUpload(event);
      expect(messageServiceSpy).toHaveBeenCalled();
    });
  });

  //TODO: Test coverage on lines 17-31

});
