import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { interval, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { Session } from '../../models/session';
import { FieldValidationStatus, Option } from '../../models/formHelpers';
import { SessionService } from '../../services/session.service';

// Angular Material snack bar
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ButtonModule} from 'primeng/button';

enum SessionStatus {
  Before = 'before',
  During = 'during',
  After = 'after',
}

@Component({
  selector: 'app-session',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatSnackBarModule, ButtonModule],
  templateUrl: './session.component.html',
})
export class SessionComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly sessionService = inject(SessionService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly snack = inject(MatSnackBar);
  readonly loading = signal(false);
  readonly hasError = signal(false);

  // UI flags
  readonly saving = signal(false);

  // Domain state
  readonly session = signal<Session>({
    practiceTime: 0,
    whatToPractice: '',
    sessionIntent: '',
    postPracticeReflection: '',
    goalForNextTime: '',
    id: '6badcbb7-afbf-4e28-8fdd-b6e068a493c1',
    date: Date(),
  });

  readonly sessionStatus = signal<SessionStatus>(SessionStatus.Before);
  readonly resourcesAdded = signal<boolean>(false);

  // Timer
  private timerSub?: Subscription;
  private startTimestamp = signal<number | null>(null);
  readonly elapsedMs = signal<number>(0);
  readonly timeDisplay = computed(() => this.formatTime(this.elapsedMs()));

  readonly fieldValidationStatus = FieldValidationStatus;
  readonly validationStatus: Option[] = [
    { label: 'invalid', value: FieldValidationStatus.INVALID },
    { label: 'warning', value: FieldValidationStatus.EMPTY },
    { label: 'valid', value: FieldValidationStatus.VALID },
  ];

  readonly prePracticeForm = this.fb.group({
    practiceTime: this.fb.control<string>('', {
      validators: [Validators.required, Validators.pattern(/^\d+$/)],
    }),
    whatToPractice: this.fb.control<string>('', { validators: [Validators.required] }),
    sessionIntent: this.fb.control<string>('', { validators: [Validators.required] }),
  });

  readonly afterForm = this.fb.group({
    sessionReflection: this.fb.control<string>('', { validators: [Validators.required] }),
    goalForNextTime: this.fb.control<string>('', { validators: [Validators.required] }),
  });

  // Getters for template
  get practiceTimeCtrl(): AbstractControl { return this.prePracticeForm.get('practiceTime')!; }
  get whatToPracticeCtrl(): AbstractControl { return this.prePracticeForm.get('whatToPractice')!; }
  get sessionIntentCtrl(): AbstractControl { return this.prePracticeForm.get('sessionIntent')!; }
  get sessionReflectionCtrl(): AbstractControl { return this.afterForm.get('sessionReflection')!; }
  get goalForNextTimeCtrl(): AbstractControl { return this.afterForm.get('goalForNextTime')!; }

  // Submit (Finish)
  onSubmit(): void {
    if (this.afterForm.invalid || this.prePracticeForm.invalid) return;

    const payload = this.buildCreatePayload();

    this.loading.set(true);
    this.hasError.set(false);

    this.saving.set(true);

    this.sessionService.create(payload)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.saving.set(false))
      )
      .subscribe({
        next: () => {
          this.snack.open('Session saved 🎸', 'Close', { duration: 2500 });
          this.router.navigate(['/']);
        },
        error: () => {
          this.snack.open('Could not save session. Please try again.', 'Dismiss', { duration: 4000 });
        },
      });
  }

  // Timer
  startTimer(): void {
    const now = Date.now();
    const already = this.elapsedMs();
    this.startTimestamp.set(now - already);

    this.timerSub?.unsubscribe();
    this.timerSub = interval(1000)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        const start = this.startTimestamp();
        if (start != null) this.elapsedMs.set(Date.now() - start);
      });

    this.sessionStatus.set(SessionStatus.During);
  }

  stopTimer(): void {
    this.timerSub?.unsubscribe();
    this.timerSub = undefined;
    this.startTimestamp.set(null);
    this.session.update((s) => ({ ...s, practiceTime: this.elapsedMs() }));
    this.sessionStatus.set(SessionStatus.After);
  }

  addResourcesToSession(): void {
    this.resourcesAdded.set(true);
  }

  private formatTime(ms: number): string {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${this.pad2(minutes)}:${this.pad2(seconds)}`;
  }
  private pad2(n: number): string { return n.toString().padStart(2, '0'); }

  private buildCreatePayload() {
    const pre = this.prePracticeForm.value;
    const post = this.afterForm.value;

    // Map your form → Firestore document shape
    // Adjust these property names to match your Session/Firestore schema
    return {
      whatToPractice: pre.whatToPractice.trim() ?? '',
      sessionIntent: pre.sessionIntent ?? '' ,
      postPracticeReflection: post.sessionReflection ?? '',
      goalForNextTime: post.goalForNextTime ?? '',
      practiceTime: this.elapsedMs()
      // Any other fields you currently save, EXCEPT id/date/startedAt
    }
  }

}
