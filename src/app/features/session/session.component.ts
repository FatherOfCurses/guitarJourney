import { Component, DestroyRef, HostListener, effect, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { SessionService } from '@services/session.service';
import { Router } from '@angular/router';
import { ResourceService } from '../../services/resource.service';
import { SessionResource } from '../../models/session-resource';
import { SessionResourcePickerComponent } from './session-resource-picker/session-resource-picker.component';
import { SessionResourceComponent } from './session-resource/session-resource.component';
import { SessionTimerService } from '../../services/session-timer.service';
export type SessionPhase = 'Before' | 'During' | 'After';

@Component({
  selector: 'app-session',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, SessionResourcePickerComponent, SessionResourceComponent],
  providers: [SessionTimerService],
  templateUrl: './session.component.html',
})
export class SessionComponent {
  private fb = inject(FormBuilder);
  private sessionService = inject(SessionService);
  private resourceService = inject(ResourceService);
  private router = inject(Router);
  private messageService = inject(MessageService);
  private destroyRef = inject(DestroyRef);
  private timer = inject(SessionTimerService);

  // ---------- STATE ----------
  // Session phase for the @switch in the template
  private _status = signal<SessionPhase>('Before');
  status = this._status.asReadonly();

  // Pending resources staged before session save
  private _pendingResources = signal<Omit<SessionResource, 'id' | 'pinnedAt'>[]>([]);
  readonly pendingResources = this._pendingResources.asReadonly();

  // Loading/saving flags for the AFTER form buttons
  private _loading = signal(false);
  loading = this._loading.asReadonly();

  private _saving = signal(false);
  saving = this._saving.asReadonly();

  // Practice goal (in minutes) set before starting
  practiceGoalMinutes = this.timer.goalMinutes;

  // Timer — owned by SessionTimerService; these are pass-throughs for the template.
  elapsedSeconds = this.timer.elapsedSeconds;

  // Display the elapsed time as mm:ss in the template
  timeDisplay = this.timer.timeDisplay;

  // True once the timer has been running for 90s without being stopped —
  // triggers the idle breath-pulse animation on the timer display.
  timerIdlePulse = this.timer.idlePulse;

  // True once the goal is met/exceeded (timer keeps running!)
  goalReached = this.timer.goalReached;

  // Optional: side-effect when user first reaches the goal (toast/log/etc.)
  private onGoalReachOnce = effect(() => {
    if (this.goalReached()) {
      // Replace with your toast/snackbar if desired
      // e.g., this.toast.success('Goal time reached! Keep going or end when ready.');
      // console.log('🎉 Practice goal reached!');
    }
  });

  // ---------- FORMS ----------
  // BEFORE form
  beforeForm: FormGroup = this.fb.group({
    practiceTime: [0, [Validators.required, Validators.min(0)]],
    whatToPractice: ['', [Validators.required, Validators.minLength(2)]],
    sessionIntent: ['', [Validators.required, Validators.minLength(2)]],
  });

  // AFTER form
  afterForm: FormGroup = this.fb.group({
    sessionReflection: ['', [Validators.required, Validators.minLength(2)]],
    goalForNextTime: ['', [Validators.required, Validators.minLength(2)]],
  });

  // Template expects these getters & names
  get practiceTimeCtrl() { return this.beforeForm.get('practiceTime')!; }
  get whatToPracticeCtrl() { return this.beforeForm.get('whatToPractice')!; }
  get sessionIntentCtrl() { return this.beforeForm.get('sessionIntent')!; }

  get sessionReflectionCtrl() { return this.afterForm.get('sessionReflection')!; }
  get goalForNextTimeCtrl() { return this.afterForm.get('goalForNextTime')!; }

  // Your HTML disables Start with "prePracticeForm.invalid"; keep this alias for compatibility.
  get prePracticeForm() { return this.beforeForm; }

  // ---------- TEMPLATE CALLED HELPERS ----------
  onResourceAdded(resource: Omit<SessionResource, 'id' | 'pinnedAt'>): void {
    const key = resource.url ?? resource.label;
    if (this._pendingResources().some(r => (r.url ?? r.label) === key)) return;
    this._pendingResources.update(arr => [...arr, resource]);
  }

  onResourceRemoved(label: string): void {
    this._pendingResources.update(arr => arr.filter(r => r.label !== label));
  }

  // Called by BEFORE form submit
  start() {
    // Set practice goal in minutes (can be 0 = no goal). The service resets the clock
    // and keeps ticking past the goal.
    const goalMinutes = Number(this.practiceTimeCtrl.value) || 0;
    this.timer.start(goalMinutes);
    this._status.set('During');
  }

  // Called by DURING End button
  stopTimer() {
    this.timer.stop();
    this._status.set('After');
  }

  /**
   * Warns before the tab closes/reloads while a save is in flight. The real risk window is
   * between sessionService.create() resolving and saveResources() finishing: the session
   * document already exists, but any pending resource not yet written only lives in this
   * component's memory. There's no way to detect or recover that after the fact, so the only
   * mitigation is asking the user not to leave yet — Angular removes this listener
   * automatically on destroy, matching every other 'window:' HostListener's lifecycle.
   */
  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload(event: BeforeUnloadEvent): void {
    if (!this._saving()) return;
    event.preventDefault();
    event.returnValue = '';
  }

  // Called by AFTER form button(s)
  async onSubmit(): Promise<void> {
    this._loading.set(true);
    this._saving.set(true);
    try {
      const sessionId = await this.sessionService.create({
        whatToPractice: this.whatToPracticeCtrl.value,
        sessionIntent: this.sessionIntentCtrl.value,
        postPracticeReflection: this.sessionReflectionCtrl.value,
        goalForNextTime: this.goalForNextTimeCtrl.value,
        practiceTime: this.elapsedSeconds() / 60,
      });
      const resourceCount = this._pendingResources().length;
      if (resourceCount > 0) {
        await this.resourceService.saveResources(sessionId, this._pendingResources());
      }
      this._saving.set(false);
      this._loading.set(false);
      if (resourceCount > 0) {
        // Every pending resource is already saved to the library automatically (the
        // memory-first pattern — see saveResources()); this just makes that visible, since
        // otherwise a resource typed fresh during the session becomes a permanent library
        // entry with no confirmation the user ever sees. Not sticky: nothing to act on, and
        // it fires right before navigating away to the dashboard, where the shell's single
        // global <p-toast/> (not a per-page one) keeps it from being destroyed mid-display.
        this.messageService.add({
          severity: 'success',
          summary: 'Resources saved',
          detail: `${resourceCount} resource${resourceCount === 1 ? '' : 's'} added to your library.`,
        });
      }
      this.router.navigate(['/app']);
    } catch (error) {
      console.error('Error saving session:', error);
      this._saving.set(false);
      this._loading.set(false);
      // Sticky: a failed save loses the whole session, so it must not auto-dismiss.
      this.messageService.add({
        severity: 'error',
        summary: 'Save failed',
        detail: 'Could not save session. Please try again.',
        sticky: true,
      });
    }
  }

  // The practice clock, including interval cleanup on destroy, belongs to
  // SessionTimerService — provided at this component, so it is destroyed alongside it.
}
