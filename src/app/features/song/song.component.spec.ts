import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SongComponent } from './song.component';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { MessageService } from "primeng/api";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { SongModule } from "./song.module";

describe('SongComponent', () => {
  let component: SongComponent;
  let fixture: ComponentFixture<SongComponent>;
  let messageService: { add: jest.Mock<any, any> };
  let messageServiceSpy: jest.SpyInstance;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[SongModule],
      providers: [
        HttpClient,
        HttpHandler,
        { provide: MessageService, useValue: messageServiceSpy }
    ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
    fixture = TestBed.createComponent(SongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  describe('Upload dialog', () => {
    xit('successfully fires upload event', () => {
      const event = { file: { name: 'testFile.txt' } };
      component.onUpload(event);
      expect(messageServiceSpy).toHaveBeenCalled();
    });
  });

  //TODO: Test coverage on lines 17-31

});
