import { ComponentFixture, TestBed} from '@angular/core/testing';
import { NavigationComponent } from './navigation.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('SidebarComponent', () => {
  let fixture: ComponentFixture<NavigationComponent>;
  let component: NavigationComponent;
  let navigation: any;

  beforeEach( () => {
    TestBed.configureTestingModule({
      declarations: [NavigationComponent],
      imports: [],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
    fixture = TestBed.createComponent(NavigationComponent);
    navigation = fixture.componentInstance;
    navigation.ngOnInit();
    fixture.detectChanges();
  });

  it('should create', async () => {
    expect(navigation).toBeTruthy();
  });

  it("items array is initialized with four MenuItem objects in the ngOnInit method", () => {
    expect(navigation.items.length).toBe(4);
  });

  it("each MenuItem object in the items array has the correct properties", () => {
    const item = navigation.items[0];
    expect(item.icon).toBeDefined();
    expect(item.routerLink).toBeDefined();
    expect(item.label).toBeDefined();
  });

  it('each MenuItem object in the items array has a valid icon property', () => {
    for (const item of navigation.items) {
      expect(item.icon).toMatch(/^pi pi-fw pi-.*/);
    }
  });

  it('each MenuItem object in the items array has a valid label property', () => {
    for (const item of navigation.items) {
      expect(item.label).toBeDefined();
      expect(typeof item.label).toBe('string');
    }
  });

  it('each MenuItem object in the items array has a valid routerLink property', () => {
    for (const item of navigation.items) {
      expect(item.routerLink).toBeDefined();
      expect(Array.isArray(item.routerLink)).toBe(true);
      expect(item.routerLink.length).toBeGreaterThan(0);
    }
  });

  it('all MenuItem objects in the items array have a routerLink property', () => {
    for (const item of navigation.items) {
      expect(item.routerLink).toBeDefined();
    }
  });

  it('all MenuItem objects in the items array have either an icon or a label property', () => {
    for (const item of navigation.items) {
      expect(item.icon || item.label).toBeDefined();
    }
  });
});
