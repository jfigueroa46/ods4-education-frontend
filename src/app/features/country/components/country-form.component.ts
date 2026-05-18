import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CountryService } from '../../../core/services/country.service';
import { AlertComponent } from '../../../shared/components/alert.component';

/**
 * Form component for creating and editing a Country.
 * Detects if an ID is in the route to switch between create/edit mode.
 */
@Component({
  selector: 'app-country-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, AlertComponent],
  template: `
    <div class="page-header fade-in">
      <div>
        <p class="text-muted mb-0" style="font-size:0.8rem">Países</p>
        <h2>{{ isEdit ? 'Editar País' : 'Nuevo País' }}</h2>
      </div>
      <a routerLink="/countries" class="btn btn-outline-secondary">
        <i class="bi bi-arrow-left me-1"></i> Atrás
      </a>
    </div>

    <app-alert [message]="alertMsg" [type]="alertType"></app-alert>

    <div class="card fade-in" style="max-width:580px">
      <div class="card-header">
        <h5><i class="bi bi-globe-americas me-2"></i>{{ isEdit ? 'Editar' : 'Crear' }} País</h5>
      </div>
      <div class="card-body p-4">
        <form [formGroup]="form" (ngSubmit)="onSubmit()">

          <div class="mb-3">
            <label class="form-label">Nombre del País <span class="text-danger">*</span></label>
            <input formControlName="countryName" type="text" class="form-control"
                   [class.is-invalid]="isInvalid('countryName')" placeholder="p. ej. Colombia">
            <div class="invalid-feedback">El nombre es requerido (mín 2 caracteres).</div>
          </div>

          <div class="mb-4">
            <label class="form-label">Región</label>
            <input formControlName="region" type="text" class="form-control" placeholder="p. ej. América del Sur">
          </div>

          <div class="d-flex gap-2">
            <button type="submit" class="btn btn-primary px-4" [disabled]="saving">
              <span *ngIf="saving" class="spinner-border spinner-border-sm me-2"></span>
              <i *ngIf="!saving" class="bi bi-check-lg me-1"></i>
              {{ isEdit ? 'Actualizar' : 'Crear' }}
            </button>
            <a routerLink="/countries" class="btn btn-outline-secondary">Cancelar</a>
          </div>

        </form>
      </div>
    </div>
  `
})
export class CountryFormComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  countryId!: number;
  saving = false;
  alertMsg = '';
  alertType: 'success' | 'danger' = 'success';

  constructor(
    private fb: FormBuilder,
    private countryService: CountryService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      countryName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      region: ['', [Validators.maxLength(100)]]
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.countryId = +id;
      this.countryService.getById(this.countryId).subscribe({
        next: (data) => this.form.patchValue(data),
        error: () => this.showAlert('No se pudo cargar los datos del país.', 'danger')
      });
    }
  }

  isInvalid(field: string): boolean {
    const ctrl = this.form.get(field);
    return !!(ctrl && ctrl.invalid && ctrl.touched);
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    this.saving = true;
    const payload = this.form.value;

    if (this.isEdit) {
      this.countryService.update(this.countryId, payload).subscribe({
        next: () => this.router.navigate(['/countries']),
        error: () => { this.showAlert('No se pudo actualizar el país.', 'danger'); this.saving = false; }
      });
    } else {
      this.countryService.create(payload).subscribe({
        next: () => this.router.navigate(['/countries']),
        error: () => { this.showAlert('No se pudo crear el país.', 'danger'); this.saving = false; }
      });
    }
  }

  showAlert(msg: string, type: 'success' | 'danger'): void {
    this.alertMsg = msg; this.alertType = type;
    setTimeout(() => { this.alertMsg = ''; }, 3500);
  }
}
