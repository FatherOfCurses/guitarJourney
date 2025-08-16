// dashboard/dashboard.component.ts
import { Component, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  standalone: true,
  imports: [],
  template: './dashboard.component.html',
})
export class DashboardComponent {
  private route = inject(ActivatedRoute);

  data = signal<any>(this.route.snapshot.data['prefetch']);
  weekTotal = signal(this.data().recentMinutes.reduce((a:number,b:number)=>a+b,0));

  images = [
    '/assets/inspo/1.jpg',
    '/assets/inspo/2.jpg',
    '/assets/inspo/3.jpg',
  ];
  currentIdx = signal(0);
  currentImage = signal(this.images[0]);

  // simple rotation
  _rotate = effect(onCleanup => {
    const id = setInterval(() => {
      const next = (this.currentIdx() + 1) % this.images.length;
      this.currentIdx.set(next);
      this.currentImage.set(this.images[next]);
    }, 6000);
    onCleanup(() => clearInterval(id));
  });
}
