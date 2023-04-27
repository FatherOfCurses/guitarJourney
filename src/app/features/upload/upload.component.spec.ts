import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UploadComponent } from './upload.component';
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClient, HttpHandler } from "@angular/common/http";
import { UploadService } from "../../services/upload.service";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import UploadServiceMock from "../../../__mocks__/services/upload.service.mock";

describe('UploadComponent', () => {
  let component: UploadComponent;
  let fixture: ComponentFixture<UploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule
      ],
      providers: [
        FormBuilder,
        HttpClient,
        HttpHandler,
        { provide: UploadService, useValue: UploadServiceMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [ UploadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
