// sessions-list.component.ts (standalone)
import { Component, computed, signal, input, output, model } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'gj-sessions-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './landing-page.component.html'
  // styleUrls: ['./landing-page.component.css']
})
export class SessionsListComponent {
  // signal inputs (immutable from parent)
  sessions = input.required<{ id: string; startedAt: string; durationMs: number }[]>();
  loading = input(false);

  // two-way example (if editing filters in child)
  filter = model<string>('all');

  // outputs as signal-backed emitters
  select = output<string>();

  totalMinutes = computed(
    () => Math.round((this.sessions()?.reduce((a, s) => a + s.durationMs, 0) ?? 0) / 60000)
  );
}
