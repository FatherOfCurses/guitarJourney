import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, filter, switchMap, catchError, of } from 'rxjs';
import { SongsService } from '@services/songs.service';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-display-song',
  standalone: true,
  imports: [CommonModule, ButtonModule, CardModule],
  templateUrl: './display-song.component.html',
})
export class DisplaySongComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly songsService = inject(SongsService);

  readonly songId = toSignal(
    this.route.paramMap.pipe(
      map(pm => pm.get('id')),
      filter((id): id is string => !!id)
    ),
    { initialValue: null }
  );

  readonly song = toSignal(
    this.route.paramMap.pipe(
      map(pm => pm.get('id')),
      filter((id): id is string => !!id),
      switchMap(id => this.songsService.get$(id)),
      catchError(() => of(null))
    ),
    { initialValue: null }
  );

  readonly loading = computed(() => this.song() === null && this.songId() !== null);

  returnToList(): void {
    this.router.navigate(['/app', 'songs']);
  }
}
