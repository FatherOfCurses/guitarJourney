import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { IDLE_PULSE_SECONDS, SessionTimerService } from './session-timer.service';

describe('SessionTimerService', () => {
  let timer: SessionTimerService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [SessionTimerService] });
    timer = TestBed.inject(SessionTimerService);
  });

  afterEach(() => timer.stop());

  describe('ticking', () => {
    it('starts at zero and is not running', () => {
      expect(timer.elapsedSeconds()).toBe(0);
      expect(timer.isRunning).toBe(false);
    });

    it('increments once per second while running', fakeAsync(() => {
      timer.start();
      expect(timer.elapsedSeconds()).toBe(0);
      tick(1000);
      expect(timer.elapsedSeconds()).toBe(1);
      tick(2000);
      expect(timer.elapsedSeconds()).toBe(3);
      timer.stop();
    }));

    it('reports it is running only between start and stop', fakeAsync(() => {
      timer.start();
      expect(timer.isRunning).toBe(true);
      timer.stop();
      expect(timer.isRunning).toBe(false);
    }));

    it('stops incrementing after stop()', fakeAsync(() => {
      timer.start();
      tick(2000);
      timer.stop();
      tick(5000);
      expect(timer.elapsedSeconds()).toBe(2);
    }));

    it('preserves the elapsed count after stopping', fakeAsync(() => {
      timer.start();
      tick(3000);
      timer.stop();
      expect(timer.elapsedSeconds()).toBe(3);
    }));

    it('resets to zero when restarted', fakeAsync(() => {
      timer.start();
      tick(5000);
      timer.start();
      expect(timer.elapsedSeconds()).toBe(0);
      timer.stop();
    }));

    it('does not double-tick when start is called twice', fakeAsync(() => {
      timer.start();
      timer.start();
      tick(1000);
      expect(timer.elapsedSeconds()).toBe(1);
      timer.stop();
    }));

    it('tolerates stop() when never started', () => {
      expect(() => timer.stop()).not.toThrow();
    });
  });

  describe('timeDisplay', () => {
    it('renders mm:ss with a zero-padded seconds field', fakeAsync(() => {
      timer.start();
      expect(timer.timeDisplay()).toBe('0:00');
      tick(5000);
      expect(timer.timeDisplay()).toBe('0:05');
      tick(55000);
      expect(timer.timeDisplay()).toBe('1:00');
      tick(65000);
      expect(timer.timeDisplay()).toBe('2:05');
      timer.stop();
    }));
  });

  describe('idlePulse', () => {
    it(`is false before ${IDLE_PULSE_SECONDS}s`, fakeAsync(() => {
      timer.start();
      tick((IDLE_PULSE_SECONDS - 1) * 1000);
      expect(timer.idlePulse()).toBe(false);
      timer.stop();
    }));

    it(`becomes true at ${IDLE_PULSE_SECONDS}s`, fakeAsync(() => {
      timer.start();
      tick(IDLE_PULSE_SECONDS * 1000);
      expect(timer.idlePulse()).toBe(true);
      timer.stop();
    }));
  });

  describe('goalReached', () => {
    it('is false when no goal was set, however long it runs', fakeAsync(() => {
      timer.start(0);
      tick(600_000);
      expect(timer.goalReached()).toBe(false);
      timer.stop();
    }));

    it('is false before the goal', fakeAsync(() => {
      timer.start(2);
      tick(119_000);
      expect(timer.goalReached()).toBe(false);
      timer.stop();
    }));

    it('is true exactly at the goal', fakeAsync(() => {
      timer.start(2);
      tick(120_000);
      expect(timer.goalReached()).toBe(true);
      timer.stop();
    }));

    it('keeps running past the goal rather than stopping', fakeAsync(() => {
      timer.start(1);
      tick(90_000);
      expect(timer.goalReached()).toBe(true);
      expect(timer.isRunning).toBe(true);
      expect(timer.elapsedSeconds()).toBe(90);
      timer.stop();
    }));

    it('clears the goal when restarted without one', fakeAsync(() => {
      timer.start(1);
      tick(60_000);
      expect(timer.goalReached()).toBe(true);
      timer.start();
      tick(60_000);
      expect(timer.goalReached()).toBe(false);
      timer.stop();
    }));
  });

  describe('cleanup', () => {
    it('clears the interval when the injector is destroyed', fakeAsync(() => {
      timer.start();
      tick(1000);
      TestBed.resetTestingModule();
      // A surviving interval would make fakeAsync fail with pending timers here.
      tick(5000);
      expect(timer.elapsedSeconds()).toBe(1);
    }));
  });
});
