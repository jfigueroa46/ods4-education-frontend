import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

/**
 * Responsive sidebar with navigation links to all modules.
 */
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  template: `
    <!-- Mobile overlay -->
    <div class="sidebar-overlay" [class.show]="mobileOpen" (click)="closeMobile()"></div>

    <!-- Sidebar -->
    <nav class="sidebar" [class.open]="mobileOpen">
      <!-- Brand -->
      <div class="sidebar-brand">
        <div class="brand-icon">
          <i class="bi bi-mortarboard-fill"></i>
        </div>
        <div class="brand-text">
          ODS Educación
          <small>Sistema de Gestión</small>
        </div>
      </div>

      <!-- Nav links -->
      <div class="sidebar-nav">

        <div class="nav-section-label">Principal</div>

        <a routerLink="/dashboard" routerLinkActive="active" class="nav-link" (click)="closeMobile()">
          <i class="bi bi-grid-1x2-fill"></i>
          Panel Principal
        </a>

        <div class="nav-section-label mt-2">Objetivos</div>

        <a routerLink="/countries" routerLinkActive="active" class="nav-link" (click)="closeMobile()">
          <i class="bi bi-globe-americas"></i>
          Países
        </a>

        <a routerLink="/ods" routerLinkActive="active" class="nav-link" (click)="closeMobile()">
          <i class="bi bi-bullseye"></i>
          ODS
        </a>

        <a routerLink="/goals" routerLinkActive="active" class="nav-link" (click)="closeMobile()">
          <i class="bi bi-flag-fill"></i>
          Objetivos
        </a>

        <a routerLink="/indicators" routerLinkActive="active" class="nav-link" (click)="closeMobile()">
          <i class="bi bi-bar-chart-line-fill"></i>
          Indicadores
        </a>

        <div class="nav-section-label mt-2">Educación</div>

        <a routerLink="/educational-institutions" routerLinkActive="active" class="nav-link" (click)="closeMobile()">
          <i class="bi bi-building-fill"></i>
          Instituciones
        </a>

        <a routerLink="/educational-programs" routerLinkActive="active" class="nav-link" (click)="closeMobile()">
          <i class="bi bi-journal-bookmark-fill"></i>
          Programas
        </a>

        <div class="nav-section-label mt-2">Personas</div>

        <a routerLink="/persons" routerLinkActive="active" class="nav-link" (click)="closeMobile()">
          <i class="bi bi-person-fill"></i>
          Personas
        </a>

        <a routerLink="/students" routerLinkActive="active" class="nav-link" (click)="closeMobile()">
          <i class="bi bi-person-video2"></i>
          Estudiantes
        </a>

        <a routerLink="/teachers" routerLinkActive="active" class="nav-link" (click)="closeMobile()">
          <i class="bi bi-person-workspace"></i>
          Profesores
        </a>
      </div>
    </nav>

    <!-- Mobile toggle button -->
    <button class="btn btn-primary mobile-toggle d-md-none" (click)="toggleMobile()">
      <i class="bi bi-list"></i>
    </button>
  `,
  styles: [`
    .mobile-toggle {
      position: fixed;
      top: 1rem;
      left: 1rem;
      z-index: 1100;
      border-radius: 8px;
      width: 40px;
      height: 40px;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    @media (min-width: 769px) {
      .mobile-toggle { display: none !important; }
    }
  `]
})
export class SidebarComponent {
  mobileOpen = false;

  toggleMobile(): void {
    this.mobileOpen = !this.mobileOpen;
  }

  closeMobile(): void {
    this.mobileOpen = false;
  }
}
