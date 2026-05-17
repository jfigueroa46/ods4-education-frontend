import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EducationalProgramService } from '../../../core/services/educational-program.service';
import { CountryService } from '../../../core/services/country.service';
import { EducationalInstitutionService } from '../../../core/services/educational-institution.service';
import { EducationalProgram, Country, EducationalInstitution } from '../../../core/models/models';
import { AlertComponent } from '../../../shared/components/alert.component';
import { PageHeaderComponent } from '../../../shared/components/page-header.component';

@Component({
  selector: 'app-program-list',
  standalone: true,
  imports: [CommonModule, RouterLink, AlertComponent, PageHeaderComponent],
  template: `
    <app-page-header title="Programs" subtitle="Manage" actionLink="/educational-programs/new" actionLabel="New Program"></app-page-header>
    <app-alert [message]="alertMsg" [type]="alertType"></app-alert>

    <div class="card fade-in">
      <div class="card-header">
        <h5><i class="bi bi-journal-bookmark-fill me-2"></i>Program List</h5>
        <span class="badge rounded-pill" style="background:#b7791f;color:#fff">{{ programs.length }} records</span>
      </div>
      <div class="card-body p-0">
        <div *ngIf="loading" class="text-center py-5 text-muted">
          <div class="spinner-border spinner-border-sm me-2"></div>Loading...
        </div>
        <div class="table-responsive" *ngIf="!loading">
          <table class="table table-hover align-middle mb-0">
            <thead>
              <tr>
                <th>#</th>
                <th>Program Name</th>
                <th>Institution</th>
                <th>Country</th>
                <th>Level</th>
                <th>Start Year</th>
                <th class="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let p of programs">
                <td class="text-muted" style="font-size:0.8rem">{{ p.id }}</td>
                <td class="fw-semibold">{{ p.programName }}</td>
                <td class="text-muted" style="font-size:0.82rem">{{ getInstitutionName(p.institutionId) }}</td>
                <td class="text-muted" style="font-size:0.82rem">{{ getCountryName(p.countryId) }}</td>
                <td>
                  <span class="badge" style="background:#fef3c7;color:#b7791f;font-weight:600">
                    {{ p.educationalLevel || '—' }}
                  </span>
                </td>
                <td>{{ p.startYear || '—' }}</td>
                <td class="text-end">
                  <a [routerLink]="['/educational-programs/detail', p.id]" class="btn btn-sm btn-outline-secondary me-1"><i class="bi bi-eye"></i></a>
                  <a [routerLink]="['/educational-programs/edit', p.id]" class="btn btn-sm btn-outline-primary me-1"><i class="bi bi-pencil"></i></a>
                  <button class="btn btn-sm btn-outline-danger" (click)="confirmDelete(p)"><i class="bi bi-trash"></i></button>
                </td>
              </tr>
              <tr *ngIf="programs.length === 0">
                <td colspan="7" class="text-center text-muted py-4">No programs found.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class ProgramListComponent implements OnInit {
  programs: EducationalProgram[] = [];
  countries: Country[] = [];
  institutions: EducationalInstitution[] = [];
  loading = true;
  alertMsg = ''; alertType: 'success'|'danger' = 'success';

  constructor(
    private programService: EducationalProgramService,
    private countryService: CountryService,
    private instService: EducationalInstitutionService
  ) {}

  ngOnInit(): void {
    this.countryService.getAll().subscribe({ next: (d) => { this.countries = d; } });
    this.instService.getAll().subscribe({ next: (d) => { this.institutions = d; } });
    this.load();
  }

  load(): void {
    this.loading = true;
    this.programService.getAll().subscribe({
      next: (d) => { this.programs = d; this.loading = false; },
      error: () => { this.showAlert('Failed to load programs.', 'danger'); this.loading = false; }
    });
  }

  getCountryName(id: number): string {
    const c = this.countries.find(c => c.id === id);
    return c ? c.countryName : `Country #${id}`;
  }

  getInstitutionName(id: number): string {
    const inst = this.institutions.find(i => i.id === id);
    return inst ? inst.institutionName : `Institution #${id}`;
  }

  confirmDelete(p: EducationalProgram): void {
    if (confirm(`Delete program "${p.programName}"?`)) {
      this.programService.delete(p.id!).subscribe({
        next: () => { this.showAlert('Program deleted.', 'success'); this.load(); },
        error: () => this.showAlert('Failed to delete.', 'danger')
      });
    }
  }

  showAlert(msg: string, type: 'success'|'danger'): void {
    this.alertMsg = msg; this.alertType = type;
    setTimeout(() => { this.alertMsg = ''; }, 3500);
  }
}
