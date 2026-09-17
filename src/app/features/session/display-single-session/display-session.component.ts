import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, filter, switchMap, catchError, of } from 'rxjs';
import { SessionService } from '@services/session.service';
import { ResourceService } from '../../../services/resource.service';
import { SessionResource } from '../../../models/session-resource';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { Skeleton } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { SessionResourceComponent } from '../session-resource/session-resource.component';

@Component({
  selector: 'app-display-single-session',
  standalone: true,
  imports: [CommonModule, ButtonModule, CardModule, Skeleton, TableModule, SessionResourceComponent],
  templateUrl: './display-session.component.html',
})
export class DisplaySessionComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly sessionService = inject(SessionService);
  private readonly resourceService = inject(ResourceService);

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

  /**
   * Resources pinned to this session, read from the denormalized session subcollection
   * rather than the global library — so a resource later deleted from the library still
   * appears in the history of the sessions that used it.
   *
   * `undefined` means still loading; `[]` means loaded and empty. A failed read resolves
   * to `[]` so it degrades to "no resources" instead of breaking the whole page.
   */
  readonly resources = toSignal(
    this.route.paramMap.pipe(
      map(pm => pm.get('id')),
      filter((id): id is string => !!id),
      switchMap(id =>
        this.resourceService.getSessionResources(id).pipe(catchError(() => of([] as SessionResource[])))
      )
    ),
    { initialValue: undefined }
  );

  readonly resourcesLoading = computed(() => this.resources() === undefined);
  readonly hasResources = computed(() => (this.resources() ?? []).length > 0);

  readonly loading = computed(() => this.session() === null && this.sessionId() !== null);
  readonly hasError = computed(() => this.sessionId() !== null && this.session() === null);

  returnToTable(): void {
    this.router.navigate(['/app','sessions']);
  }

  goToDashboard(): void {
    this.router.navigate(['/app', 'dashboard']);
  }
}
