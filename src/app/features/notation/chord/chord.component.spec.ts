import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChordComponent } from './chord.component';
import { ChordObject } from '../../../models/chord';

describe('ChordComponent', () => {
  let component: ChordComponent;
  let fixture: ComponentFixture<ChordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChordComponent ],
      providers: [ChordObject]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
