import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EducationalInstitutionService } from '../../../core/services/educational-institution.service';
import { CountryService } from '../../../core/services/country.service';
import { Country } from '../../../core/models/models';
import { AlertComponent } from '../../../shared/components/alert.component';

@Component({
  selector: 'app-institution-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, AlertComponent],
  template: `
    <div class="page-header fade-in">
      <div><p class="text-muted mb-0" style="font-size:0.8rem">Instituciones</p><h2>{{ isEdit ? 'Editar Institución' : 'Nueva Institución' }}</h2></div>
      <a routerLink="/educational-institutions" class="btn btn-outline-secondary"><i class="bi bi-arrow-left me-1"></i>Atrás</a>
    </div>
    <app-alert [message]="alertMsg" [type]="alertType"></app-alert>

    <div class="card fade-in" style="max-width:760px">
      <div class="card-header"><h5><i class="bi bi-building-fill me-2"></i>{{ isEdit ? 'Editar' : 'Crear' }} Institución</h5></div>
      <div class="card-body p-4">
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="row g-3">

            <div class="col-12">
              <label class="form-label">País <span class="text-danger">*</span></label>
              <select formControlName="countryId" class="form-select" [class.is-invalid]="isInvalid('countryId')">
                <option value="">— Seleccionar País —</option>
                <option *ngFor="let c of countries" [value]="c.id">{{ c.countryName }}</option>
              </select>
              <div class="invalid-feedback">Por favor selecciona un país.</div>
            </div>

            <div class="col-sm-8">
              <label class="form-label">Nombre de la Institución <span class="text-danger">*</span></label>
              <input formControlName="institutionName" type="text" class="form-control"
                     [class.is-invalid]="isInvalid('institutionName')" placeholder="p. ej. Universidad Nacional">
              <div class="invalid-feedback">El nombre es requerido.</div>
            </div>

            <div class="col-sm-4">
              <label class="form-label">Tipo de Institución</label>
              <select formControlName="institutionType" class="form-select">
                <option value="">— Seleccionar —</option>
                <option>Público</option>
                <option>Privado</option>
                <option>Mixto</option>
              </select>
            </div>

            <div class="col-sm-6">
              <label class="form-label">Acceso a Internet</label>
              <select formControlName="internetAccess" class="form-select">
                <option value="">— Seleccionar —</option>
                <option>Sí</option>
                <option>No</option>
                <option>Parcial</option>
              </select>
            </div>

            <div class="col-sm-6">
              <label class="form-label">Cantidad de Estudiantes</label>
              <input formControlName="studentCount" type="number" class="form-control" placeholder="0" min="0">
            </div>

            <div class="col-12">
              <label class="form-label">Estado de Infraestructura</label>
              <select formControlName="infrastructureStatus" class="form-select">
                <option value="">— Seleccionar —</option>
                <option>Excelente</option>
                <option>Bueno</option>
                <option>Regular</option>
                <option>Deficiente</option>
              </select>
            </div>

          </div>

          <div class="d-flex gap-2 mt-4">
            <button type="submit" class="btn btn-primary px-4" [disabled]="saving">
              <span *ngIf="saving" class="spinner-border spinner-border-sm me-2"></span>
              <i *ngIf="!saving" class="bi bi-check-lg me-1"></i>
              {{ isEdit ? 'Actualizar' : 'Crear' }}
            </button>
            <a routerLink="/educational-institutions" class="btn btn-outline-secondary">Cancelar</a>
          </div>

        </form>
      </div>
    </div>
  `
})
export class InstitutionFormComponent implements OnInit {
  form!: FormGroup;
  countries: Country[] = [];
  isEdit = false; institutionId!: number; saving = false;
  alertMsg = ''; alertType: 'success'|'danger' = 'success';

  constructor(
    private fb: FormBuilder,
    private instService: EducationalInstitutionService,
    private countryService: CountryService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      countryId:           ['', Validators.required],
      institutionName:     ['', [Validators.required, Validators.maxLength(150)]],
      institutionType:     [''],
      internetAccess:      [''],
      studentCount:        [null],
      infrastructureStatus:['']
    });

    this.countryService.getAll().subscribe({ next: (d) => { this.countries = d; } });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.institutionId = +id;
      this.instService.getById(this.institutionId).subscribe({ next: (d) => this.form.patchValue(d) });
    }
  }

  isInvalid(f: string): boolean {
    const c = this.form.get(f);
    return !!(c && c.invalid && c.touched);
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;
    const payload = { ...this.form.value, countryId: +this.form.value.countryId };
    const action = this.isEdit
      ? this.instService.update(this.institutionId, payload)
      : this.instService.create(payload);

    action.subscribe({
      next: () => this.router.navigate(['/educational-institutions']),
      error: () => { this.showAlert('Operación fallida.', 'danger'); this.saving = false; }
    });
  }

  showAlert(msg: string, type: 'success'|'danger'): void {
    this.alertMsg = msg; this.alertType = type;
    setTimeout(() => { this.alertMsg = ''; }, 3500);
  }
}
