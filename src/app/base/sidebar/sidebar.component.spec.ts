import { ComponentFixture, TestBed} from '@angular/core/testing';
import { SidebarComponent } from './sidebar.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('SidebarComponent', () => {
  let fixture: ComponentFixture<SidebarComponent>;
  let component: SidebarComponent;

  beforeEach( () => {
    TestBed.configureTestingModule({
      declarations: [SidebarComponent],
      imports: [],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', async () => {
    expect(component).toBeTruthy();
  });
});
