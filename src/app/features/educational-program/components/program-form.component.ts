import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EducationalProgramService } from '../../../core/services/educational-program.service';
import { CountryService } from '../../../core/services/country.service';
import { EducationalInstitutionService } from '../../../core/services/educational-institution.service';
import { Country, EducationalInstitution } from '../../../core/models/models';
import { AlertComponent } from '../../../shared/components/alert.component';

@Component({
  selector: 'app-program-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, AlertComponent],
  template: `
    <div class="page-header fade-in">
      <div><p class="text-muted mb-0" style="font-size:0.8rem">Programas</p><h2>{{ isEdit ? 'Editar Programa' : 'Nuevo Programa' }}</h2></div>
      <a routerLink="/educational-programs" class="btn btn-outline-secondary"><i class="bi bi-arrow-left me-1"></i>Atrás</a>
    </div>
    <app-alert [message]="alertMsg" [type]="alertType"></app-alert>

    <div class="card fade-in" style="max-width:760px">
      <div class="card-header"><h5><i class="bi bi-journal-bookmark-fill me-2"></i>{{ isEdit ? 'Editar' : 'Crear' }} Programa</h5></div>
      <div class="card-body p-4">
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="row g-3">

            <div class="col-sm-6">
              <label class="form-label">País <span class="text-danger">*</span></label>
              <select formControlName="countryId" class="form-select" [class.is-invalid]="isInvalid('countryId')">
                <option value="">— Seleccionar País —</option>
                <option *ngFor="let c of countries" [value]="c.id">{{ c.countryName }}</option>
              </select>
              <div class="invalid-feedback">Por favor selecciona un país.</div>
            </div>

            <div class="col-sm-6">
              <label class="form-label">Institución <span class="text-danger">*</span></label>
              <select formControlName="institutionId" class="form-select" [class.is-invalid]="isInvalid('institutionId')">
                <option value="">— Seleccionar Institución —</option>
                <option *ngFor="let i of institutions" [value]="i.id">{{ i.institutionName }}</option>
              </select>
              <div class="invalid-feedback">Por favor selecciona una institución.</div>
            </div>

            <div class="col-12">
              <label class="form-label">Nombre del Programa <span class="text-danger">*</span></label>
              <input formControlName="programName" type="text" class="form-control"
                     [class.is-invalid]="isInvalid('programName')" placeholder="p. ej. Programa de Educación Básica">
              <div class="invalid-feedback">El nombre del programa es requerido.</div>
            </div>

            <div class="col-sm-6">
              <label class="form-label">Nivel Educativo</label>
              <select formControlName="educationalLevel" class="form-select">
                <option value="">— Seleccionar —</option>
                <option>Preescolar</option>
                <option>Primaria</option>
                <option>Secundaria</option>
                <option>Educación Superior</option>
                <option>Técnico</option>
                <option>Postgrado</option>
              </select>
            </div>

            <div class="col-sm-3">
              <label class="form-label">Beneficiarios</label>
              <input formControlName="beneficiaries" type="number" class="form-control" placeholder="0" min="0">
            </div>

            <div class="col-sm-3">
              <label class="form-label">Año de Inicio</label>
              <input formControlName="startYear" type="number" class="form-control" placeholder="2024" min="1900" max="2100">
            </div>

          </div>

          <div class="d-flex gap-2 mt-4">
            <button type="submit" class="btn btn-primary px-4" [disabled]="saving">
              <span *ngIf="saving" class="spinner-border spinner-border-sm me-2"></span>
              <i *ngIf="!saving" class="bi bi-check-lg me-1"></i>
              {{ isEdit ? 'Actualizar' : 'Crear' }}
            </button>
            <a routerLink="/educational-programs" class="btn btn-outline-secondary">Cancelar</a>
          </div>

        </form>
      </div>
    </div>
  `
})
export class ProgramFormComponent implements OnInit {
  form!: FormGroup;
  countries: Country[] = [];
  institutions: EducationalInstitution[] = [];
  isEdit = false; programId!: number; saving = false;
  alertMsg = ''; alertType: 'success'|'danger' = 'success';

  constructor(
    private fb: FormBuilder,
    private programService: EducationalProgramService,
    private countryService: CountryService,
    private instService: EducationalInstitutionService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      countryId:       ['', Validators.required],
      institutionId:   ['', Validators.required],
      programName:     ['', [Validators.required, Validators.maxLength(150)]],
      educationalLevel:[''],
      beneficiaries:   [null],
      startYear:       [null]
    });

    this.countryService.getAll().subscribe({ next: (d) => { this.countries = d; } });
    this.instService.getAll().subscribe({ next: (d) => { this.institutions = d; } });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.programId = +id;
      this.programService.getById(this.programId).subscribe({ next: (d) => this.form.patchValue(d) });
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
      countryId: +this.form.value.countryId,
      institutionId: +this.form.value.institutionId
    };
    const action = this.isEdit
      ? this.programService.update(this.programId, payload)
      : this.programService.create(payload);

    action.subscribe({
      next: () => this.router.navigate(['/educational-programs']),
      error: () => { this.showAlert('Operación fallida.', 'danger'); this.saving = false; }
    });
  }

  showAlert(msg: string, type: 'success'|'danger'): void {
    this.alertMsg = msg; this.alertType = type;
    setTimeout(() => { this.alertMsg = ''; }, 3500);
  }
}
