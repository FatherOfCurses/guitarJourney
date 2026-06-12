import { Component, DestroyRef, effect, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SessionService } from '@services/session.service';
import { Router } from '@angular/router';
import { ResourceService } from '../../services/resource.service';
import { SessionResource } from '../../models/session-resource';
export type SessionPhase = 'Before' | 'During' | 'After';

@Component({
  selector: 'app-session',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule],
  templateUrl: './session.component.html',
})
export class SessionComponent {
  private fb = inject(FormBuilder);
  private sessionService = inject(SessionService);
  private resourceService = inject(ResourceService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  // ---------- STATE ----------
  // Session phase for the @switch in the template
  private _status = signal<SessionPhase>('Before');
  status = this._status.asReadonly();

  // Track whether user opted to add resources (your HTML checks resourcesAdded())
  private _resourcesAdded = signal(false);
  resourcesAdded = this._resourcesAdded.asReadonly();

  // Pending resources staged before session save
  private _pendingResources = signal<Omit<SessionResource, 'id' | 'pinnedAt'>[]>([]);
  readonly pendingResources = this._pendingResources.asReadonly();

  // Loading/saving flags for the AFTER form buttons
  private _loading = signal(false);
  loading = this._loading.asReadonly();

  private _saving = signal(false);
  saving = this._saving.asReadonly();

  // Practice goal (in minutes) set before starting
  private _practiceGoalMinutes = signal<number>(0);
  practiceGoalMinutes = this._practiceGoalMinutes.asReadonly();

  // Timer
  private tickHandle: any = null;
  private _elapsedSeconds = signal(0);
  elapsedSeconds = this._elapsedSeconds.asReadonly();

  // Display the elapsed time as mm:ss in the template
  timeDisplay = computed(() => {
    const s = this._elapsedSeconds();
    const m = Math.floor(s / 60);
    const ss = String(s % 60).padStart(2, '0');
    return `${m}:${ss}`;
  });

  // True once the goal is met/exceeded (timer keeps running!)
  goalReached = computed(() => {
    const goal = this._practiceGoalMinutes();
    return goal > 0 && this._elapsedSeconds() >= goal * 60;
  });

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
  addResourcesToSession() {
    this._resourcesAdded.set(true);
  }

  onResourceAdded(resource: Omit<SessionResource, 'id' | 'pinnedAt'>): void {
    if (this._pendingResources().some(r => r.url === resource.url)) return;
    this._pendingResources.update(arr => [...arr, resource]);
  }

  onResourceRemoved(url: string): void {
    this._pendingResources.update(arr => arr.filter(r => r.url !== url));
  }

  // Called by BEFORE form submit
  start() {

    // Set practice goal in minutes (can be 0 = no goal)
    const goalMinutes = Number(this.practiceTimeCtrl.value) || 0;
    this._practiceGoalMinutes.set(goalMinutes);

    // Reset timer and move to DURING
    this._elapsedSeconds.set(0);
    this._status.set('During');

    // Start ticking every second; keeps going even after reaching the goal
    this.clearTick();
    this.tickHandle = setInterval(() => {
      this._elapsedSeconds.update(v => v + 1);
    }, 1000);
  }

  // Called by DURING End button
  stopTimer() {
    this.clearTick();
    this._status.set('After');
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
      if (this._pendingResources().length > 0) {
        await this.resourceService.saveResources(sessionId, this._pendingResources());
      }
      this._saving.set(false);
      this._loading.set(false);
      this.router.navigate(['/app']);
    } catch (error) {
      console.error('Error saving session:', error);
      this._saving.set(false);
      this._loading.set(false);
    }
  }

  // ---------- UTIL ----------
  private clearTick() {
    if (this.tickHandle) {
      clearInterval(this.tickHandle);
      this.tickHandle = null;
    }
  }

  // Clean up interval on destroy
  ngOnDestroy() {
    this.clearTick();
  }
}
