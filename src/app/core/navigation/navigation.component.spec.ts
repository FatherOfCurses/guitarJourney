import { ComponentFixture, TestBed} from '@angular/core/testing';
import { NavigationComponent } from './navigation.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('SidebarComponent', () => {
  let fixture: ComponentFixture<NavigationComponent>;
  let component: NavigationComponent;

  beforeEach( () => {
    TestBed.configureTestingModule({
      declarations: [NavigationComponent],
      imports: [],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
    fixture = TestBed.createComponent(NavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', async () => {
    expect(component).toBeTruthy();
  });
});
