import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './shared/navbar/sidebar.component';

/**
 * Root component. Renders the sidebar and the main router outlet.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent],
  template: `
    <div class="app-wrapper">
      <app-sidebar></app-sidebar>
      <div class="main-content">
        <router-outlet></router-outlet>
      </div>
    </div>
  `
})
export class AppComponent {}
