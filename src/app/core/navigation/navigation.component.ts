import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Menubar } from 'primeng/menubar';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
    selector: 'app-navigation-menu',
    templateUrl: './navigation.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    //styleUrls: ['./navigation.component.scss'],
    imports: [Menubar, CommonModule], 
    standalone: true
})
export class NavigationComponent implements OnInit{
  items: MenuItem[] | undefined;

  constructor(private router: Router) {}

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
