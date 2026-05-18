import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CountryService } from '../../../core/services/country.service';
import { Country } from '../../../core/models/models';
import { AlertComponent } from '../../../shared/components/alert.component';
import { PageHeaderComponent } from '../../../shared/components/page-header.component';

/**
 * Lists all countries with Edit, Detail, and Delete actions.
 */
@Component({
  selector: 'app-country-list',
  standalone: true,
  imports: [CommonModule, RouterLink, AlertComponent, PageHeaderComponent],
  template: `
    <app-page-header
      title="Países"
      subtitle="Administrar"
      actionLink="/countries/new"
      actionLabel="Nuevo País">
    </app-page-header>

    <app-alert [message]="alertMsg" [type]="alertType"></app-alert>

    <div class="card fade-in">
      <div class="card-header">
        <h5><i class="bi bi-globe-americas me-2"></i>Lista de Países</h5>
        <span class="badge bg-primary rounded-pill">{{ countries.length }} registros</span>
      </div>
      <div class="card-body p-0">
        <div *ngIf="loading" class="text-center py-5 text-muted">
          <div class="spinner-border spinner-border-sm me-2"></div> Cargando...
        </div>

        <div class="table-responsive" *ngIf="!loading">
          <table class="table table-hover align-middle mb-0">
            <thead>
              <tr>
                <th>#</th>
                <th>Nombre del País</th>
                <th>Región</th>
                <th class="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let c of countries">
                <td class="text-muted" style="font-size:0.8rem">{{ c.id }}</td>
                <td>
                  <span class="fw-600">{{ c.countryName }}</span>
                </td>
                <td>
                  <span class="badge rounded-pill" style="background:#e8f4fd;color:#2d6a9f;font-weight:600">
                    {{ c.region || '—' }}
                  </span>
                </td>
                <td class="text-end">
                  <a [routerLink]="['/countries/detail', c.id]" class="btn btn-sm btn-outline-secondary me-1">
                    <i class="bi bi-eye"></i>
                  </a>
                  <a [routerLink]="['/countries/edit', c.id]" class="btn btn-sm btn-outline-primary me-1">
                    <i class="bi bi-pencil"></i>
                  </a>
                  <button class="btn btn-sm btn-outline-danger" (click)="confirmDelete(c)">
                    <i class="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
              <tr *ngIf="countries.length === 0">
                <td colspan="4" class="text-center text-muted py-4">No se encontraron países.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class CountryListComponent implements OnInit {
  countries: Country[] = [];
  loading = true;
  alertMsg = '';
  alertType: 'success' | 'danger' = 'success';

  constructor(private countryService: CountryService) {}

  ngOnInit(): void {
    this.loadCountries();
  }

  loadCountries(): void {
    this.loading = true;
    this.countryService.getAll().subscribe({
      next: (data) => { this.countries = data; this.loading = false; },
      error: () => { this.showAlert('No se pudo cargar los países.', 'danger'); this.loading = false; }
    });
  }

  confirmDelete(country: Country): void {
    if (confirm(`¿Eliminar "${country.countryName}"? Esta acción no se puede deshacer.`)) {
      this.countryService.delete(country.id!).subscribe({
        next: () => { this.showAlert('País eliminado exitosamente.', 'success'); this.loadCountries(); },
        error: () => this.showAlert('No se pudo eliminar el país.', 'danger')
      });
    }
  }

  showAlert(msg: string, type: 'success' | 'danger'): void {
    this.alertMsg = msg;
    this.alertType = type;
    setTimeout(() => { this.alertMsg = ''; }, 3500);
  }
}
