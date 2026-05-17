import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TeacherService } from '../../../core/services/teacher.service';
import { PersonService } from '../../../core/services/person.service';
import { EducationalInstitutionService } from '../../../core/services/educational-institution.service';
import { Teacher, Person, EducationalInstitution } from '../../../core/models/models';
import { AlertComponent } from '../../../shared/components/alert.component';
import { PageHeaderComponent } from '../../../shared/components/page-header.component';

@Component({
  selector: 'app-teacher-list',
  standalone: true,
  imports: [CommonModule, RouterLink, AlertComponent, PageHeaderComponent],
  template: `
    <app-page-header title="Teachers" subtitle="Manage" actionLink="/teachers/new" actionLabel="New Teacher"></app-page-header>
    <app-alert [message]="alertMsg" [type]="alertType"></app-alert>

    <div class="card fade-in">
      <div class="card-header">
        <h5><i class="bi bi-person-workspace me-2"></i>Teacher List</h5>
        <span class="badge rounded-pill" style="background:#c05621;color:#fff">{{ teachers.length }} records</span>
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
                <th>Name</th>
                <th>Institution</th>
                <th>Specialty</th>
                <th>Level</th>
                <th>Salary</th>
                <th class="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let t of teachers">
                <td class="text-muted" style="font-size:0.8rem">{{ t.id }}</td>
                <td class="fw-semibold">{{ getPersonName(t.personId) }}</td>
                <td class="text-muted" style="font-size:0.82rem">{{ getInstitutionName(t.institutionId) }}</td>
                <td>
                  <span class="badge" style="background:#fff7ed;color:#c05621;font-weight:600">
                    {{ t.specialty || '—' }}
                  </span>
                </td>
                <td style="font-size:0.82rem">{{ t.educationLevel || '—' }}</td>
                <td style="font-size:0.82rem">
                  <span *ngIf="t.salary">$ {{ t.salary | number:'1.2-2' }}</span>
                  <span *ngIf="!t.salary">—</span>
                </td>
                <td class="text-end">
                  <a [routerLink]="['/teachers/detail', t.id]" class="btn btn-sm btn-outline-secondary me-1"><i class="bi bi-eye"></i></a>
                  <a [routerLink]="['/teachers/edit', t.id]" class="btn btn-sm btn-outline-primary me-1"><i class="bi bi-pencil"></i></a>
                  <button class="btn btn-sm btn-outline-danger" (click)="confirmDelete(t)"><i class="bi bi-trash"></i></button>
                </td>
              </tr>
              <tr *ngIf="teachers.length === 0">
                <td colspan="7" class="text-center text-muted py-4">No teachers found.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class TeacherListComponent implements OnInit {
  teachers: Teacher[] = [];
  persons: Person[] = [];
  institutions: EducationalInstitution[] = [];
  loading = true;
  alertMsg = ''; alertType: 'success'|'danger' = 'success';

  constructor(
    private teacherService: TeacherService,
    private personService: PersonService,
    private instService: EducationalInstitutionService
  ) {}

  ngOnInit(): void {
    this.personService.getAll().subscribe({ next: (d) => { this.persons = d; } });
    this.instService.getAll().subscribe({ next: (d) => { this.institutions = d; } });
    this.load();
  }

  load(): void {
    this.loading = true;
    this.teacherService.getAll().subscribe({
      next: (d) => { this.teachers = d; this.loading = false; },
      error: () => { this.showAlert('Failed to load teachers.', 'danger'); this.loading = false; }
    });
  }

  getPersonName(id: number): string {
    const p = this.persons.find(p => p.id === id);
    return p ? `${p.firstName} ${p.lastName}` : `Person #${id}`;
  }

  getInstitutionName(id: number): string {
    const i = this.institutions.find(i => i.id === id);
    return i ? i.institutionName : `Institution #${id}`;
  }

  confirmDelete(t: Teacher): void {
    if (confirm(`Delete this teacher?`)) {
      this.teacherService.delete(t.id!).subscribe({
        next: () => { this.showAlert('Teacher deleted.', 'success'); this.load(); },
        error: () => this.showAlert('Failed to delete.', 'danger')
      });
    }
  }

  showAlert(msg: string, type: 'success'|'danger'): void {
    this.alertMsg = msg; this.alertType = type;
    setTimeout(() => { this.alertMsg = ''; }, 3500);
  }
}
