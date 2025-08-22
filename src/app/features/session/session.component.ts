import { Component, DestroyRef, computed, inject, signal } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { interval, Subscription } from 'rxjs'
import { Timestamp } from 'firebase/firestore'

import { SessionService } from '../../services/session.service'
import { Session } from '../../models/session'

enum SessionStatus {
  Before = 'Before',
  During = 'During',
  After = 'After',
  Done = 'Done',
}

@Component({
  selector: 'app-session',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `<!-- template omitted; logic-only refactor -->`,
})
export class SessionComponent {
  private readonly fb = inject(FormBuilder)
  private readonly router = inject(Router)
  private readonly destroyRef = inject(DestroyRef)
  private readonly sessions = inject(SessionService)

  // --- Forms ---
  readonly beforeForm = this.fb.nonNullable.group({
    whatToPractice: ['', [Validators.maxLength(2000)]],
    sessionIntent: ['', [Validators.maxLength(500)]],
  })

  readonly afterForm = this.fb.nonNullable.group({
    sessionReflection: ['', [Validators.maxLength(2000)]],
    goalForNextTime: ['', [Validators.maxLength(500)]],
  })

  // --- State ---
  readonly status = signal<SessionStatus>(SessionStatus.Before)
  private timerSub?: Subscription
  private startedAt: number | null = null // epoch ms

  // Elapsed milliseconds while status === During
  readonly elapsedMs = signal<number>(0)
  readonly elapsedMin = computed(() =>
    Math.max(0, Math.round(this.elapsedMs() / 60000)),
  )

  // --- Lifecycle helpers ---
  start() {
    if (this.status() !== SessionStatus.Before) return
    this.status.set(SessionStatus.During)
    this.startedAt = Date.now()
    // tick every second
    this.timerSub?.unsubscribe()
    this.timerSub = interval(1000)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        if (this.startedAt != null) {
          this.elapsedMs.set(Date.now() - this.startedAt)
        }
      })
  }

  stop() {
    if (this.status() !== SessionStatus.During) return
    this.status.set(SessionStatus.After)
    this.timerSub?.unsubscribe()
    this.timerSub = undefined
  }

  async save() {
    // Build payload for SessionsService.create()
    // Session model uses Firestore Timestamp for `date`
    const pre = this.beforeForm.getRawValue()
    const post = this.afterForm.getRawValue()

    const practiceTime = this.elapsedMin() // minutes (integer)

    const payload: Omit<Session, 'id' | 'ownerUid' | 'date'> & {
      date?: Timestamp
    } = {
      practiceTime,
      whatToPractice: (pre.whatToPractice ?? '').trim(),
      sessionIntent: (pre.sessionIntent ?? '').trim(),
      postPracticeReflection: (post.sessionReflection ?? '').trim(),
      goalForNextTime: (post.goalForNextTime ?? '').trim(),
      // date omitted → will default to now() inside the service
    }

    try {
      const id = await this.sessions.create(payload)
      this.status.set(SessionStatus.Done)
      // Navigate to detail or list as you prefer
      await this.router.navigate(['/sessions', id])
    } catch (e) {
      console.error('Failed to save session', e)
      // Optionally surface an error state to the UI
    }
  }

  cancel() {
    this.timerSub?.unsubscribe()
    this.timerSub = undefined
    this.status.set(SessionStatus.Before)
    this.elapsedMs.set(0)
    this.startedAt = null
    this.beforeForm.reset({ whatToPractice: '', sessionIntent: '' })
    this.afterForm.reset({ sessionReflection: '', goalForNextTime: '' })
  }
}
