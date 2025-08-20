"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@angular/core/testing");
const songs_component_1 = require("./songs.component");
describe('SongsComponent', () => {
    let component;
    let fixture;
    beforeEach(async () => {
        await testing_1.TestBed.configureTestingModule({
            imports: [songs_component_1.SongsComponent]
        })
            .compileComponents();
        fixture = testing_1.TestBed.createComponent(songs_component_1.SongsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
