import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * Simple dashboard with stat cards and quick navigation links.
 */
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="fade-in">
      <!-- Header -->
      <div class="mb-4">
        <p class="text-muted mb-0" style="font-size:0.8rem">Welcome back</p>
        <h2 style="font-weight:800;color:#1e3a5f">Dashboard</h2>
      </div>

      <!-- Stat Cards -->
      <div class="row g-3 mb-4">
        <div class="col-sm-6 col-xl-3">
          <div class="stat-card" style="background:linear-gradient(135deg,#1e3a5f,#2d6a9f)">
            <div class="stat-label">Countries</div>
            <div class="stat-value">—</div>
            <i class="bi bi-globe-americas stat-icon"></i>
          </div>
        </div>
        <div class="col-sm-6 col-xl-3">
          <div class="stat-card" style="background:linear-gradient(135deg,#1a7a4a,#27a262)">
            <div class="stat-label">ODS Goals</div>
            <div class="stat-value">17</div>
            <i class="bi bi-bullseye stat-icon"></i>
          </div>
        </div>
        <div class="col-sm-6 col-xl-3">
          <div class="stat-card" style="background:linear-gradient(135deg,#7b3fa0,#a055c9)">
            <div class="stat-label">Students</div>
            <div class="stat-value">—</div>
            <i class="bi bi-person-video2 stat-icon"></i>
          </div>
        </div>
        <div class="col-sm-6 col-xl-3">
          <div class="stat-card" style="background:linear-gradient(135deg,#c05621,#e07943)">
            <div class="stat-label">Teachers</div>
            <div class="stat-value">—</div>
            <i class="bi bi-person-workspace stat-icon"></i>
          </div>
        </div>
      </div>

      <!-- Quick Access -->
      <div class="row g-3">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h5><i class="bi bi-lightning-charge-fill me-2 text-warning"></i>Quick Access</h5>
            </div>
            <div class="card-body">
              <div class="row g-3">
                <div class="col-6 col-md-4 col-lg-3" *ngFor="let item of quickLinks">
                  <a [routerLink]="item.route" class="text-decoration-none">
                    <div class="d-flex align-items-center gap-3 p-3 rounded-3"
                         style="background:#f8fafc;border:1.5px solid #e2e8f0;transition:all 0.2s"
                         onmouseenter="this.style.borderColor='#2d6a9f';this.style.background='#eff6ff'"
                         onmouseleave="this.style.borderColor='#e2e8f0';this.style.background='#f8fafc'">
                      <div class="rounded-2 d-flex align-items-center justify-content-center"
                           style="width:38px;height:38px;font-size:1.2rem"
                           [style.background]="item.color + '22'">
                        <i class="bi" [class]="item.icon" [style.color]="item.color"></i>
                      </div>
                      <span style="font-size:0.82rem;font-weight:600;color:#2d3748">{{ item.label }}</span>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent {
  quickLinks = [
    { label: 'Countries',     route: '/countries',                icon: 'bi-globe-americas',       color: '#2d6a9f' },
    { label: 'ODS',           route: '/ods',                      icon: 'bi-bullseye',             color: '#1a7a4a' },
    { label: 'Goals',         route: '/goals',                    icon: 'bi-flag-fill',            color: '#c05621' },
    { label: 'Indicators',    route: '/indicators',               icon: 'bi-bar-chart-line-fill',  color: '#7b3fa0' },
    { label: 'Institutions',  route: '/educational-institutions', icon: 'bi-building-fill',        color: '#0f7490' },
    { label: 'Programs',      route: '/educational-programs',     icon: 'bi-journal-bookmark-fill',color: '#b7791f' },
    { label: 'Persons',       route: '/persons',                  icon: 'bi-person-fill',          color: '#4a5568' },
    { label: 'Students',      route: '/students',                 icon: 'bi-person-video2',        color: '#7b3fa0' },
    { label: 'Teachers',      route: '/teachers',                 icon: 'bi-person-workspace',     color: '#c05621' },
  ];
}
