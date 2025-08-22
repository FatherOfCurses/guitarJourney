"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@angular/core/testing");
const testing_2 = require("@angular/common/http/testing");
const http_1 = require("@angular/common/http");
const session_service_1 = require("./session.service");
describe('SessionService (with inject() + API_BASE_URL token)', () => {
    let service;
    let httpMock;
    // Use a test URL to prove the token is respected
    const TEST_BASE_URL = 'https://example.test';
    beforeEach(() => {
        testing_1.TestBed.configureTestingModule({
            imports: [testing_2.HttpClientTestingModule],
            providers: [
                session_service_1.SessionService,
                { provide: session_service_1.API_BASE_URL, useValue: TEST_BASE_URL },
            ],
        });
        service = testing_1.TestBed.inject(session_service_1.SessionService);
        httpMock = testing_1.TestBed.inject(testing_2.HttpTestingController);
    });
    afterEach(() => {
        httpMock.verify();
    });
    describe('getSession$', () => {
        it('issues GET to /sessions/:id and returns a Session', (done) => {
            const id = 'abc123';
            const mockSession = { id };
            service.getSession$(id).subscribe({
                next: (res) => {
                    expect(res).toEqual(mockSession);
                    done();
                },
                error: done.fail,
            });
            const req = httpMock.expectOne(`${TEST_BASE_URL}/sessions/${id}`);
            expect(req.request.method).toBe('GET');
            req.flush(mockSession);
        });
        it('propagates HTTP errors', (done) => {
            const id = 'missing';
            service.getSession$(id).subscribe({
                next: () => done.fail('expected error'),
                error: (err) => {
                    expect(err).toBeInstanceOf(http_1.HttpErrorResponse);
                    expect(err.status).toBe(404);
                    done();
                },
            });
            const req = httpMock.expectOne(`${TEST_BASE_URL}/sessions/${id}`);
            expect(req.request.method).toBe('GET');
            req.flush({ message: 'Not found' }, { status: 404, statusText: 'Not Found' });
        });
    });
    describe('getAllSessions$', () => {
        it('issues GET to /sessions and returns Session[]', (done) => {
            const mock = [
                { id: '1' },
                { id: '2' },
            ];
            service.getAllSessions$().subscribe({
                next: (res) => {
                    expect(res).toEqual(mock);
                    done();
                },
                error: done.fail,
            });
            const req = httpMock.expectOne(`${TEST_BASE_URL}/sessions`);
            expect(req.request.method).toBe('GET');
            req.flush(mock);
        });
    });
    describe('putSession$', () => {
        it('issues PUT to /sessions with object body and JSON header', (done) => {
            const input = { id: 'xyz' };
            service.putSession$(input).subscribe({
                next: (res) => {
                    expect(res).toEqual(input);
                    done();
                },
                error: done.fail,
            });
            const req = httpMock.expectOne(`${TEST_BASE_URL}/sessions`);
            expect(req.request.method).toBe('PUT');
            // Body should be the object itself (no JSON.stringify in service)
            expect(req.request.body).toEqual(input);
            expect(req.request.headers.get('Content-Type')).toBe('application/json');
            req.flush(input);
        });
        it('propagates server errors on PUT', (done) => {
            const input = { id: 'boom' };
            service.putSession$(input).subscribe({
                next: () => done.fail('expected error'),
                error: (err) => {
                    expect(err.status).toBe(500);
                    expect(err.statusText).toBe('Server Error');
                    done();
                },
            });
            const req = httpMock.expectOne(`${TEST_BASE_URL}/sessions`);
            expect(req.request.method).toBe('PUT');
            req.flush({ message: 'error' }, { status: 500, statusText: 'Server Error' });
        });
    });
});
