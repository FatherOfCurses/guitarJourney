import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NbMenuItem } from '@nebular/theme';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {

  items: NbMenuItem[] = [
    {
      title: 'Practice',
      link: '/session'
    },
    {
      title: 'Songs',
      link: '/songs'
    },
    {
      title: 'Practice Diary'
    },
    {
      title: 'Testing ground',
      link: '/test'
    }
  ];
}
