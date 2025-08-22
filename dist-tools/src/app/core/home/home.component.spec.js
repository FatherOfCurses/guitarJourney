"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@angular/core/testing");
const home_component_1 = require("./home.component");
describe('HomeComponent', () => {
    let fixture;
    const mockSessions = [
        { id: '1', startedAt: '2025-08-01T10:00:00Z', durationMs: 30_000 },
        { id: '2', startedAt: '2025-08-02T10:00:00Z', durationMs: 60_000 },
    ];
    beforeEach(async () => {
        await testing_1.TestBed.configureTestingModule({
            imports: [home_component_1.HomeComponent], // standalone
        }).compileComponents();
        fixture = testing_1.TestBed.createComponent(home_component_1.HomeComponent);
        // IMPORTANT: set required input BEFORE first detectChanges
        fixture.componentRef.setInput('sessions', mockSessions);
        // (optional) set other inputs if you want
        // fixture.componentRef.setInput('loading', false);
        fixture.detectChanges();
    });
    it('should create', () => {
        expect(fixture.componentInstance).toBeTruthy();
    });
});
