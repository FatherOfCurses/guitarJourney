import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { HttpErrorResponse } from '@angular/common/http';

import { SessionService, API_BASE_URL } from './session.service';
import { Session } from '../models/session';

describe('SessionService (with inject() + API_BASE_URL token)', () => {
  let service: SessionService;
  let httpMock: HttpTestingController;

  // Use a test URL to prove the token is respected
  const TEST_BASE_URL = 'https://example.test';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        SessionService,
        { provide: API_BASE_URL, useValue: TEST_BASE_URL },
      ],
    });

    service = TestBed.inject(SessionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getSession$', () => {
    it('issues GET to /sessions/:id and returns a Session', (done) => {
      const id = 'abc123';
      const mockSession = { id } as unknown as Session;

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
        error: (err: HttpErrorResponse) => {
          expect(err).toBeInstanceOf(HttpErrorResponse);
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
        { id: '1' } as unknown as Session,
        { id: '2' } as unknown as Session,
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
      const input = { id: 'xyz' } as unknown as Session;

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
      const input = { id: 'boom' } as unknown as Session;

      service.putSession$(input).subscribe({
        next: () => done.fail('expected error'),
        error: (err: HttpErrorResponse) => {
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
