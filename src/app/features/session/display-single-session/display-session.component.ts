import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, filter, switchMap, catchError, of } from 'rxjs';
import { SessionService } from '../../../services/session.service';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-display-single-session',
  standalone: true,
  imports: [CommonModule, ButtonModule, CardModule, TableModule],
  templateUrl: './display-session.component.html',
})
export class DisplaySessionComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly sessionService = inject(SessionService);

  // route param as a signal
  readonly sessionId = toSignal(
    this.route.paramMap.pipe(
      map(pm => pm.get('id')),
      filter((id): id is string => !!id)
    ),
    { initialValue: null }
  );
  
  // session data as a signal (auto-updates when id changes)
  readonly session = toSignal(
    this.route.paramMap.pipe(
      map(pm => pm.get('id')),
      filter((id): id is string => !!id),
      switchMap(id => this.sessionService.get$(id)),
      catchError(() => of(null))
    ),
    { initialValue: null }
  );

  readonly loading = computed(() => this.session() === null && this.sessionId() !== null);
  readonly hasError = computed(() => this.sessionId() !== null && this.session() === null);

ngOnInit() {
    console.log('Session ID:', this.sessionId());
    console.log('Session Data:', this.session());
}

  returnToTable(): void {
    this.router.navigate(['/app','sessions']);
  }
}
