"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@angular/core/testing");
const session_resource_component_1 = require("./session-resource.component");
describe('SessionResourceComponentComponent', () => {
    let component;
    let fixture;
    beforeEach(async () => {
        await testing_1.TestBed.configureTestingModule({
            declarations: [session_resource_component_1.SessionResourceComponent]
        })
            .compileComponents();
        fixture = testing_1.TestBed.createComponent(session_resource_component_1.SessionResourceComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
