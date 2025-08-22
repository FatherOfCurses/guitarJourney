"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@angular/core/testing");
const metrics_component_1 = require("./metrics.component");
describe('MetricsComponent', () => {
    let component;
    let fixture;
    beforeEach(async () => {
        await testing_1.TestBed.configureTestingModule({
            imports: [metrics_component_1.MetricsComponent]
        })
            .compileComponents();
        fixture = testing_1.TestBed.createComponent(metrics_component_1.MetricsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
