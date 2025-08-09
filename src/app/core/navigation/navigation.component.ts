import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
    selector: 'app-navigation-menu',
    templateUrl: './navigation.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['./navigation.component.scss'],
    standalone: false
})
export class NavigationComponent implements OnInit{
  items: MenuItem[];

  ngOnInit() {
    this.items = [
      {
        label: 'Home',
        icon: 'pi pi-fw pi-home',
        routerLink: ['/']
      },
      {
        label: 'Practice',
        icon: 'pi pi-fw pi-book',
        routerLink: ['/session']
      },
      {
        label: 'Songs',
        icon: 'pi pi-fw pi-volume-up',
        routerLink: ['/songs']
      }
      ,
      {
        label: 'Exercises',
        icon: 'pi pi-fw pi-eye',
        routerLink: ['/exercises']
      },
    ];
  }
}
