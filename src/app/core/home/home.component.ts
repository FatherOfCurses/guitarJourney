import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, computed, signal, input, output, model } from '@angular/core';

@Component({
  selector: 'app-home',
  imports: [DatePipe, DecimalPipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
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
