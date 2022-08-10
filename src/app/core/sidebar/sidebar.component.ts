import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {

  items: any[] = [
    {
      title: 'Practice',
      link: '/session'
    },
    {
      title: 'Songs',
      link: '/songs'
    },
    {
      title: 'Exercises'
    },

    {
      title: 'Testing ground',
      link: '/test'
    }
  ];
}
