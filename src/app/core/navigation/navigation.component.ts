import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-navigation-menu',
  templateUrl: './navigation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit{
  items: MenuItem[];

  ngOnInit() {
    this.items = [
      {
        label: 'Practice',
        routerLink: ['/session']
      },
      {
        label: 'Songs',
        routerLink: ['/songs']
      }
      ,
      {
        label: 'Exercises',
        routerLink: ['/notation']
      },

      {
        label: 'Testing ground',
        routerLink: ['/test']
      }
    ];
  }
}
