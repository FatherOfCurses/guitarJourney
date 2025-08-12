import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Menubar } from 'primeng/menubar';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-navigation-menu',
    templateUrl: './navigation.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    //styleUrls: ['./navigation.component.scss'],
    imports: [Menubar, CommonModule], 
    standalone: true
})
export class NavigationComponent {
  
  }

