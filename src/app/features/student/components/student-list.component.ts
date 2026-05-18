import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StudentService } from '../../../core/services/student.service';
import { PersonService } from '../../../core/services/person.service';
import { EducationalInstitutionService } from '../../../core/services/educational-institution.service';
import { EducationalProgramService } from '../../../core/services/educational-program.service';
import { Student, Person, EducationalInstitution, EducationalProgram } from '../../../core/models/models';
import { AlertComponent } from '../../../shared/components/alert.component';
import { PageHeaderComponent } from '../../../shared/components/page-header.component';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [CommonModule, RouterLink, AlertComponent, PageHeaderComponent],
  template: `
    <app-page-header title="Estudiantes" subtitle="Administrar" actionLink="/students/new" actionLabel="Nuevo Estudiante"></app-page-header>
    <app-alert [message]="alertMsg" [type]="alertType"></app-alert>

    <div class="card fade-in">
      <div class="card-header">
        <h5><i class="bi bi-person-video2 me-2"></i>Lista de Estudiantes</h5>
        <span class="badge rounded-pill" style="background:#7b3fa0;color:#fff">{{ students.length }} registros</span>
      </div>
      <div class="card-body p-0">
        <div *ngIf="loading" class="text-center py-5 text-muted">
          <div class="spinner-border spinner-border-sm me-2"></div>Cargando...
        </div>
        <div class="table-responsive" *ngIf="!loading">
          <table class="table table-hover align-middle mb-0">
            <thead>
              <tr>
                <th>#</th>
                <th>Código de Estudiante</th>
                <th>Persona</th>
                <th>Institución</th>
                <th>Programa</th>
                <th>Grado</th>
                <th>Estado</th>
                <th class="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let s of students">
                <td class="text-muted" style="font-size:0.8rem">{{ s.id }}</td>
                <td><span class="fw-semibold" style="font-family:monospace">{{ s.studentCode || '—' }}</span></td>
                <td class="text-muted" style="font-size:0.82rem">{{ getPersonName(s.personId) }}</td>
                <td class="text-muted" style="font-size:0.82rem">{{ getInstitutionName(s.institutionId) }}</td>
                <td class="text-muted" style="font-size:0.82rem">{{ getProgramName(s.programId) }}</td>
                <td>{{ s.grade || '—' }}</td>
                <td>
                  <span class="badge rounded-pill"
                    [style.background]="s.academicStatus === 'Active' ? '#d1fae5' : '#fee2e2'"
                    [style.color]="s.academicStatus === 'Active' ? '#065f46' : '#991b1b'">
                    {{ s.academicStatus === 'Active' ? 'Activo' : (s.academicStatus === 'Graduated' ? 'Egresado' : (s.academicStatus === 'Suspended' ? 'Suspendido' : (s.academicStatus === 'Withdrawn' ? 'Retirado' : s.academicStatus))) || '—' }}
                  </span>
                </td>
                <td class="text-end">
                  <a [routerLink]="['/students/detail', s.id]" class="btn btn-sm btn-outline-secondary me-1"><i class="bi bi-eye"></i></a>
                  <a [routerLink]="['/students/edit', s.id]" class="btn btn-sm btn-outline-primary me-1"><i class="bi bi-pencil"></i></a>
                  <button class="btn btn-sm btn-outline-danger" (click)="confirmDelete(s)"><i class="bi bi-trash"></i></button>
                </td>
              </tr>
              <tr *ngIf="students.length === 0">
                <td colspan="8" class="text-center text-muted py-4">No se encontraron estudiantes.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class StudentListComponent implements OnInit {
  students: Student[] = [];
  persons: Person[] = [];
  institutions: EducationalInstitution[] = [];
  programs: EducationalProgram[] = [];
  loading = true;
  alertMsg = ''; alertType: 'success'|'danger' = 'success';

  constructor(
    private studentService: StudentService,
    private personService: PersonService,
    private instService: EducationalInstitutionService,
    private programService: EducationalProgramService
  ) {}

  ngOnInit(): void {
    this.personService.getAll().subscribe({ next: (d) => { this.persons = d; } });
    this.instService.getAll().subscribe({ next: (d) => { this.institutions = d; } });
    this.programService.getAll().subscribe({ next: (d) => { this.programs = d; } });
    this.load();
  }

  load(): void {
    this.loading = true;
    this.studentService.getAll().subscribe({
      next: (d) => { this.students = d; this.loading = false; },
      error: () => { this.showAlert('No se pudo cargar los estudiantes.', 'danger'); this.loading = false; }
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

  getProgramName(id: number): string {
    const p = this.programs.find(p => p.id === id);
    return p ? p.programName : `Program #${id}`;
  }

  confirmDelete(s: Student): void {
    if (confirm(`Delete student "${s.studentCode || s.id}"?`)) {
      this.studentService.delete(s.id!).subscribe({
        next: () => { this.showAlert('Student deleted.', 'success'); this.load(); },
        error: () => this.showAlert('Failed to delete.', 'danger')
      });
    }
  }

  showAlert(msg: string, type: 'success'|'danger'): void {
    this.alertMsg = msg; this.alertType = type;
    setTimeout(() => { this.alertMsg = ''; }, 3500);
  }
}
