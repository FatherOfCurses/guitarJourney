import { DestroyRef, Injectable, computed, inject, signal } from '@angular/core';

/** Seconds of uninterrupted practice before the display starts its breath-pulse. */
export const IDLE_PULSE_SECONDS = 90;

/**
 * Owns the practice clock for a session: the tick interval, the elapsed count, and the
 * values derived from it (mm:ss display, idle pulse, goal reached).
 *
 * Kept apart from SessionComponent so the clock can be driven and asserted on without a
 * component fixture, and so the interval can never outlive the thing that started it —
 * `stop()` is idempotent and destruction always clears the handle.
 */
@Injectable()
export class SessionTimerService {
  private tickHandle: ReturnType<typeof setInterval> | null = null;

  private _elapsedSeconds = signal(0);
  readonly elapsedSeconds = this._elapsedSeconds.asReadonly();

  private _goalMinutes = signal(0);
  readonly goalMinutes = this._goalMinutes.asReadonly();

  /** Elapsed time as mm:ss, for the timer display. */
  readonly timeDisplay = computed(() => {
    const s = this._elapsedSeconds();
    const m = Math.floor(s / 60);
    const ss = String(s % 60).padStart(2, '0');
    return `${m}:${ss}`;
  });

  /** True once the timer has run IDLE_PULSE_SECONDS without being stopped. */
  readonly idlePulse = computed(() => this._elapsedSeconds() >= IDLE_PULSE_SECONDS);

  /** True once the goal is met or exceeded. A goal of 0 means no goal was set. */
  readonly goalReached = computed(() => {
    const goal = this._goalMinutes();
    return goal > 0 && this._elapsedSeconds() >= goal * 60;
  });

  /** True while the clock is ticking. */
  get isRunning(): boolean {
    return this.tickHandle !== null;
  }

  constructor() {
    // A session can be left mid-practice; the interval must not survive the component.
    inject(DestroyRef).onDestroy(() => this.stop());
  }

  /**
   * Resets the clock to zero and starts ticking every second.
   *
   * The timer deliberately keeps running past the goal — reaching the goal is a
   * milestone, not a stop condition.
   */
  start(goalMinutes = 0): void {
    this._goalMinutes.set(goalMinutes);
    this._elapsedSeconds.set(0);
    this.stop();
    this.tickHandle = setInterval(() => this._elapsedSeconds.update(v => v + 1), 1000);
  }

  /** Stops the clock, preserving the elapsed count. Safe to call when not running. */
  stop(): void {
    if (this.tickHandle !== null) {
      clearInterval(this.tickHandle);
      this.tickHandle = null;
    }
  }
}
