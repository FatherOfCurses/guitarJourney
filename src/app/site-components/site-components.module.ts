import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbCardModule, NbLayoutModule, NbMenuModule } from '@nebular/theme';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';

@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule, NbCardModule, NbLayoutModule, NbMenuModule
  ]
})
export class SiteComponentsModule { }
