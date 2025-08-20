"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@angular/core/testing");
const platform_browser_1 = require("@angular/platform-browser");
const router_1 = require("@angular/router");
const router_2 = require("@angular/router");
const not_found_component_1 = require("./not-found.component");
describe('NotFoundComponent (standalone, no RouterTestingModule)', () => {
    let fixture;
    let component;
    let router;
    beforeEach(async () => {
        await testing_1.TestBed.configureTestingModule({
            imports: [not_found_component_1.NotFoundComponent], // standalone component
            providers: [
                (0, router_2.provideRouter)([]), // modern router testing setup
            ],
        }).compileComponents();
        fixture = testing_1.TestBed.createComponent(not_found_component_1.NotFoundComponent);
        component = fixture.componentInstance;
        router = testing_1.TestBed.inject(router_1.Router);
        fixture.detectChanges();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('renders the heading text', () => {
        const h1 = fixture.debugElement.query(platform_browser_1.By.css('h1')).nativeElement;
        expect(h1.textContent?.trim()).toBe('Ouch! Wrong note!');
    });
    it('renders the illustration image with correct src and alt', () => {
        const img = fixture.debugElement.query(platform_browser_1.By.css('img')).nativeElement;
        expect(img.getAttribute('src')).toBe('assets/images/simonon.jpg');
        expect(img.getAttribute('alt')).toBe('404 illustration');
    });
    it('has a Return Home button', () => {
        const btn = fixture.debugElement.query(platform_browser_1.By.css('button')).nativeElement;
        expect(btn).toBeTruthy();
        expect(btn.textContent?.trim()).toBe('Return Home');
    });
    it('goHome() navigates to "/" (unit test on class method)', async () => {
        const navigateSpy = jest.spyOn(router, 'navigate').mockResolvedValue(true);
        component.goHome();
        expect(navigateSpy).toHaveBeenCalledWith(['/']);
    });
    it('clicking the button triggers navigation to "/" (template interaction)', async () => {
        const navigateSpy = jest.spyOn(router, 'navigate').mockResolvedValue(true);
        const btnDe = fixture.debugElement.query(platform_browser_1.By.css('button'));
        btnDe.nativeElement.click();
        fixture.detectChanges();
        expect(navigateSpy).toHaveBeenCalledWith(['/']);
    });
});
