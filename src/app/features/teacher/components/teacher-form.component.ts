import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TeacherService } from '../../../core/services/teacher.service';
import { PersonService } from '../../../core/services/person.service';
import { EducationalInstitutionService } from '../../../core/services/educational-institution.service';
import { Person, EducationalInstitution } from '../../../core/models/models';
import { AlertComponent } from '../../../shared/components/alert.component';

@Component({
  selector: 'app-teacher-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, AlertComponent],
  template: `
    <div class="page-header fade-in">
      <div><p class="text-muted mb-0" style="font-size:0.8rem">Profesores</p><h2>{{ isEdit ? 'Editar Profesor' : 'Nuevo Profesor' }}</h2></div>
      <a routerLink="/teachers" class="btn btn-outline-secondary"><i class="bi bi-arrow-left me-1"></i>Atrás</a>
    </div>
    <app-alert [message]="alertMsg" [type]="alertType"></app-alert>

    <div class="card fade-in" style="max-width:760px">
      <div class="card-header"><h5><i class="bi bi-person-workspace me-2"></i>{{ isEdit ? 'Editar' : 'Crear' }} Profesor</h5></div>
      <div class="card-body p-4">
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="row g-3">

            <div class="col-sm-6">
              <label class="form-label">Persona <span class="text-danger">*</span></label>
              <select formControlName="personId" class="form-select" [class.is-invalid]="isInvalid('personId')">
                <option value="">— Seleccionar Persona —</option>
                <option *ngFor="let p of persons" [value]="p.id">{{ p.firstName }} {{ p.lastName }} ({{ p.documentNumber }})</option>
              </select>
              <div class="invalid-feedback">Por favor selecciona una persona.</div>
            </div>

            <div class="col-sm-6">
              <label class="form-label">Institución <span class="text-danger">*</span></label>
              <select formControlName="institutionId" class="form-select" [class.is-invalid]="isInvalid('institutionId')">
                <option value="">— Seleccionar Institución —</option>
                <option *ngFor="let i of institutions" [value]="i.id">{{ i.institutionName }}</option>
              </select>
              <div class="invalid-feedback">Por favor selecciona una institución.</div>
            </div>

            <div class="col-sm-6">
              <label class="form-label">Especialidad</label>
              <input formControlName="specialty" type="text" class="form-control"
                     placeholder="p. ej. Matemáticas" maxlength="100">
            </div>

            <div class="col-sm-6">
              <label class="form-label">Nivel de Educación</label>
              <select formControlName="educationLevel" class="form-select">
                <option value="">— Seleccionar —</option>
                <option>Licenciatura</option>
                <option>Maestría</option>
                <option>Doctorado</option>
                <option>Posdoctorado</option>
                <option>Técnico</option>
              </select>
            </div>

            <div class="col-sm-6">
              <label class="form-label">Fecha de Contratación</label>
              <input formControlName="hiringDate" type="date" class="form-control">
            </div>

            <div class="col-sm-6">
              <label class="form-label">Salario (USD)</label>
              <div class="input-group">
                <span class="input-group-text">$</span>
                <input formControlName="salary" type="number" class="form-control" placeholder="0.00" min="0" step="0.01">
              </div>
            </div>

          </div>

          <div class="d-flex gap-2 mt-4">
            <button type="submit" class="btn btn-primary px-4" [disabled]="saving">
              <span *ngIf="saving" class="spinner-border spinner-border-sm me-2"></span>
              <i *ngIf="!saving" class="bi bi-check-lg me-1"></i>
              {{ isEdit ? 'Actualizar' : 'Crear' }}
            </button>
            <a routerLink="/teachers" class="btn btn-outline-secondary">Cancelar</a>
          </div>

        </form>
      </div>
    </div>
  `
})
export class TeacherFormComponent implements OnInit {
  form!: FormGroup;
  persons: Person[] = [];
  institutions: EducationalInstitution[] = [];
  isEdit = false; teacherId!: number; saving = false;
  alertMsg = ''; alertType: 'success'|'danger' = 'success';

  constructor(
    private fb: FormBuilder,
    private teacherService: TeacherService,
    private personService: PersonService,
    private instService: EducationalInstitutionService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      personId:      ['', Validators.required],
      institutionId: ['', Validators.required],
      specialty:     ['', Validators.maxLength(100)],
      educationLevel:[''],
      hiringDate:    [''],
      salary:        [null]
    });

    this.personService.getAll().subscribe({ next: (d) => { this.persons = d; } });
    this.instService.getAll().subscribe({ next: (d) => { this.institutions = d; } });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.teacherId = +id;
      this.teacherService.getById(this.teacherId).subscribe({ next: (d) => this.form.patchValue(d) });
    }
  }

  isInvalid(f: string): boolean {
    const c = this.form.get(f);
    return !!(c && c.invalid && c.touched);
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;
    const payload = {
      ...this.form.value,
      personId: +this.form.value.personId,
      institutionId: +this.form.value.institutionId
    };
    const action = this.isEdit
      ? this.teacherService.update(this.teacherId, payload)
      : this.teacherService.create(payload);

    action.subscribe({
      next: () => this.router.navigate(['/teachers']),
      error: () => { this.showAlert('Operación fallida.', 'danger'); this.saving = false; }
    });
  }

  showAlert(msg: string, type: 'success'|'danger'): void {
    this.alertMsg = msg; this.alertType = type;
    setTimeout(() => { this.alertMsg = ''; }, 3500);
  }
}
