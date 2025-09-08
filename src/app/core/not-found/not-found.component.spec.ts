import { TestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { provideRouter } from '@angular/router';

import { NotFoundComponent } from './not-found.component';

describe('NotFoundComponent (standalone, no RouterTestingModule)', () => {
  let fixture: ComponentFixture<NotFoundComponent>;
  let component: NotFoundComponent;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotFoundComponent],          // standalone component
      providers: [
        provideRouter([]),                   // modern router testing setup
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NotFoundComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders the heading text', () => {
    const h1 = fixture.debugElement.query(By.css('h1')).nativeElement as HTMLElement;
    expect(h1.textContent?.trim()).toBe('Ouch! Wrong note!');
  });

  it('renders the illustration image with correct src and alt', () => {
    const img = fixture.debugElement.query(By.css('img')).nativeElement as HTMLImageElement;
    expect(img.getAttribute('src')).toBe('assets/images/simonon.jpg');
    expect(img.getAttribute('alt')).toBe('404 illustration');
  });

  it('has a Return Home button', () => {
    const btn = fixture.debugElement.query(By.css('button')).nativeElement as HTMLButtonElement;
    expect(btn).toBeTruthy();
    expect(btn.textContent?.trim()).toBe('Return Home');
  });

  it('goHome() navigates to "/app" (unit test on class method)', async () => {
    const navigateSpy = jest.spyOn(router, 'navigate').mockResolvedValue(true as any);
    component.goHome();
    expect(navigateSpy).toHaveBeenCalledWith(['/app/dashboard']);
  });

  it('clicking the button triggers navigation to "/app" (template interaction)', async () => {
    const navigateSpy = jest.spyOn(router, 'navigate').mockResolvedValue(true as any);

    const btnDe = fixture.debugElement.query(By.css('button'));
    (btnDe.nativeElement as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(navigateSpy).toHaveBeenCalledWith(['/app/dashboard']);
  });
});
