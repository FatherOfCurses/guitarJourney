"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@angular/core/testing");
const router_1 = require("@angular/router");
const router_2 = require("@angular/router");
const rxjs_1 = require("rxjs");
const platform_browser_1 = require("@angular/platform-browser");
const display_session_component_1 = require("./display-session.component");
const session_service_1 = require("../../../services/session.service");
describe('DisplaySessionComponent (standalone)', () => {
    let fixture;
    let component;
    let router;
    // Route param stream we control per test
    let paramMap$;
    // Mock service with a configurable implementation
    let sessionSvcMock;
    const makeModule = async () => {
        paramMap$ = new rxjs_1.Subject();
        sessionSvcMock = {
            getSession$: jest.fn(),
        };
        await testing_1.TestBed.configureTestingModule({
            imports: [display_session_component_1.DisplaySessionComponent], // standalone import
            providers: [
                (0, router_1.provideRouter)([]), // modern router provider
                { provide: router_2.ActivatedRoute, useValue: { paramMap: paramMap$.asObservable() } },
                { provide: session_service_1.SessionService, useValue: sessionSvcMock },
            ],
        }).compileComponents();
        router = testing_1.TestBed.inject(router_1.Router);
        fixture = testing_1.TestBed.createComponent(display_session_component_1.DisplaySessionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges(); // initial CD
    };
    it('creates', async () => {
        await makeModule();
        expect(component).toBeTruthy();
    });
    it('loads a session when an id param appears (happy path), toggling loading/hasError', async () => {
        await makeModule();
        // Arrange service to return a value synchronously for the requested id
        const mockSession = { id: 'abc123' };
        sessionSvcMock.getSession$.mockImplementation((id) => (0, rxjs_1.of)(mockSession));
        // Emit the route param
        paramMap$.next((0, router_2.convertToParamMap)({ id: 'abc123' }));
        fixture.detectChanges(); // trigger CD after param change
        // Signals should reflect loaded state
        expect(component.sessionId()).toBe('abc123');
        expect(component.session()).toEqual(mockSession);
        expect(component.loading()).toBe(false);
        expect(component.hasError()).toBe(false);
        // Template should NOT show loading/error text
        const pTags = fixture.debugElement.queryAll(platform_browser_1.By.css('p'));
        const texts = fixture.debugElement
            .queryAll(platform_browser_1.By.css('p'))
            .map(p => p.nativeElement.textContent?.trim());
        expect(texts).not.toContain('Loading…');
        expect(texts).not.toContain('Could not load the session.');
    });
    it('shows loading… until the service emits, then shows loaded state', async () => {
        await makeModule();
        // Make the service return a subject so we control timing
        const sessionSubject = new rxjs_1.Subject();
        sessionSvcMock.getSession$.mockReturnValue(sessionSubject.asObservable());
        // Emit id -> should enter loading state
        paramMap$.next((0, router_2.convertToParamMap)({ id: 'late' }));
        fixture.detectChanges();
        expect(component.loading()).toBe(true);
        const loadingP = fixture.debugElement.queryAll(platform_browser_1.By.css('p')).find(p => p.nativeElement.textContent?.includes('Loading…'));
        expect(loadingP).toBeTruthy();
        // Now emit the session -> loading turns false
        const mock = { id: 'late' };
        sessionSubject.next(mock);
        sessionSubject.complete();
        fixture.detectChanges();
        expect(component.session()).toEqual(mock);
        expect(component.loading()).toBe(false);
        expect(component.hasError()).toBe(false);
        // Loading text disappears
        const after = fixture.debugElement.queryAll(platform_browser_1.By.css('p')).map(p => p.nativeElement.textContent?.trim());
        expect(after).not.toContain('Loading…');
    });
    it('sets hasError when the service errors and shows the error message', async () => {
        await makeModule();
        sessionSvcMock.getSession$.mockImplementation(() => (0, rxjs_1.throwError)(() => new Error('boom')));
        paramMap$.next((0, router_2.convertToParamMap)({ id: 'bad' }));
        fixture.detectChanges();
        expect(component.sessionId()).toBe('bad');
        expect(component.session()).toBeNull(); // catchError → null
        expect(component.loading()).toBe(false);
        expect(component.hasError()).toBe(true);
        const errorP = fixture.debugElement.queryAll(platform_browser_1.By.css('p')).find(p => p.nativeElement.textContent?.includes('Could not load the session.'));
        expect(errorP).toBeTruthy();
    });
    it('navigates back to /sessions when the Back button is clicked', async () => {
        await makeModule();
        const navSpy = jest.spyOn(router, 'navigate').mockResolvedValue(true);
        // Button is always rendered at the bottom of the template
        const btn = fixture.debugElement.query(platform_browser_1.By.css('button'));
        expect(btn).toBeTruthy();
        btn.nativeElement.click();
        fixture.detectChanges();
        expect(navSpy).toHaveBeenCalledWith(['/sessions']);
    });
});
