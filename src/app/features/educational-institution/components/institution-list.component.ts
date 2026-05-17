import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EducationalInstitutionService } from '../../../core/services/educational-institution.service';
import { CountryService } from '../../../core/services/country.service';
import { EducationalInstitution, Country } from '../../../core/models/models';
import { AlertComponent } from '../../../shared/components/alert.component';
import { PageHeaderComponent } from '../../../shared/components/page-header.component';

@Component({
  selector: 'app-institution-list',
  standalone: true,
  imports: [CommonModule, RouterLink, AlertComponent, PageHeaderComponent],
  template: `
    <app-page-header title="Institutions" subtitle="Manage" actionLink="/educational-institutions/new" actionLabel="New Institution"></app-page-header>
    <app-alert [message]="alertMsg" [type]="alertType"></app-alert>
    <div class="card fade-in">
      <div class="card-header">
        <h5><i class="bi bi-building-fill me-2"></i>Institution List</h5>
        <span class="badge rounded-pill" style="background:#0f7490;color:#fff">{{ institutions.length }} records</span>
      </div>
      <div class="card-body p-0">
        <div *ngIf="loading" class="text-center py-5 text-muted"><div class="spinner-border spinner-border-sm me-2"></div>Loading...</div>
        <div class="table-responsive" *ngIf="!loading">
          <table class="table table-hover align-middle mb-0">
            <thead><tr><th>#</th><th>Name</th><th>Country</th><th>Type</th><th>Students</th><th class="text-end">Actions</th></tr></thead>
            <tbody>
              <tr *ngFor="let inst of institutions">
                <td class="text-muted" style="font-size:0.8rem">{{ inst.id }}</td>
                <td class="fw-semibold">{{ inst.institutionName }}</td>
                <td class="text-muted" style="font-size:0.82rem">{{ getCountryName(inst.countryId) }}</td>
                <td><span class="badge" style="background:#e0f7fa;color:#0f7490;font-weight:600">{{ inst.institutionType || '—' }}</span></td>
                <td>{{ inst.studentCount ?? '—' }}</td>
                <td class="text-end">
                  <a [routerLink]="['/educational-institutions/detail', inst.id]" class="btn btn-sm btn-outline-secondary me-1"><i class="bi bi-eye"></i></a>
                  <a [routerLink]="['/educational-institutions/edit', inst.id]" class="btn btn-sm btn-outline-primary me-1"><i class="bi bi-pencil"></i></a>
                  <button class="btn btn-sm btn-outline-danger" (click)="confirmDelete(inst)"><i class="bi bi-trash"></i></button>
                </td>
              </tr>
              <tr *ngIf="institutions.length === 0"><td colspan="6" class="text-center text-muted py-4">No institutions found.</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class InstitutionListComponent implements OnInit {
  institutions: EducationalInstitution[] = []; countries: Country[] = [];
  loading = true; alertMsg = ''; alertType: 'success'|'danger' = 'success';

  constructor(private instService: EducationalInstitutionService, private countryService: CountryService) {}

  ngOnInit(): void {
    this.countryService.getAll().subscribe({ next: (d) => { this.countries = d; } });
    this.load();
  }

  load(): void {
    this.loading = true;
    this.instService.getAll().subscribe({
      next: (d) => { this.institutions = d; this.loading = false; },
      error: () => { this.showAlert('Failed to load institutions.', 'danger'); this.loading = false; }
    });
  }

  getCountryName(id: number): string {
    const c = this.countries.find(c => c.id === id);
    return c ? c.countryName : `Country #${id}`;
  }

  confirmDelete(inst: EducationalInstitution): void {
    if (confirm(`Delete "${inst.institutionName}"?`)) {
      this.instService.delete(inst.id!).subscribe({
        next: () => { this.showAlert('Deleted.', 'success'); this.load(); },
        error: () => this.showAlert('Failed to delete.', 'danger')
      });
    }
  }

  showAlert(msg: string, type: 'success'|'danger'): void { this.alertMsg = msg; this.alertType = type; setTimeout(() => { this.alertMsg = ''; }, 3500); }
}
