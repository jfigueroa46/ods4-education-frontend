import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PersonService } from '../../../core/services/person.service';
import { AlertComponent } from '../../../shared/components/alert.component';

@Component({
  selector: 'app-person-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, AlertComponent],
  template: `
    <div class="page-header fade-in">
      <div><p class="text-muted mb-0" style="font-size:0.8rem">Personas</p><h2>{{ isEdit ? 'Editar Persona' : 'Nueva Persona' }}</h2></div>
      <a routerLink="/persons" class="btn btn-outline-secondary"><i class="bi bi-arrow-left me-1"></i>Atrás</a>
    </div>
    <app-alert [message]="alertMsg" [type]="alertType"></app-alert>
    <div class="card fade-in" style="max-width:760px">
      <div class="card-header"><h5><i class="bi bi-person-fill me-2"></i>{{ isEdit ? 'Editar' : 'Crear' }} Persona</h5></div>
      <div class="card-body p-4">
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="row g-3">
            <div class="col-sm-6">
              <label class="form-label">Nombre <span class="text-danger">*</span></label>
              <input formControlName="firstName" type="text" class="form-control" [class.is-invalid]="isInvalid('firstName')" placeholder="Nombre">
              <div class="invalid-feedback">El nombre es requerido.</div>
            </div>
            <div class="col-sm-6">
              <label class="form-label">Apellido <span class="text-danger">*</span></label>
              <input formControlName="lastName" type="text" class="form-control" [class.is-invalid]="isInvalid('lastName')" placeholder="Apellido">
              <div class="invalid-feedback">El apellido es requerido.</div>
            </div>
            <div class="col-sm-4">
              <label class="form-label">Tipo de Documento</label>
              <select formControlName="documentType" class="form-select">
                <option value="">— Seleccionar —</option>
                <option>CC</option><option>TI</option><option>Pasaporte</option><option>NIT</option>
              </select>
            </div>
            <div class="col-sm-8">
              <label class="form-label">Número de Documento <span class="text-danger">*</span></label>
              <input formControlName="documentNumber" type="text" class="form-control" [class.is-invalid]="isInvalid('documentNumber')" placeholder="Número de documento">
              <div class="invalid-feedback">El número de documento es requerido.</div>
            </div>
            <div class="col-sm-4">
              <label class="form-label">Fecha de Nacimiento</label>
              <input formControlName="birthDate" type="date" class="form-control">
            </div>
            <div class="col-sm-4">
              <label class="form-label">Género</label>
              <select formControlName="gender" class="form-select">
                <option value="">— Seleccionar —</option>
                <option>Masculino</option><option>Femenino</option><option>Otro</option>
              </select>
            </div>
            <div class="col-sm-4">
              <label class="form-label">Teléfono</label>
              <input formControlName="phone" type="text" class="form-control" placeholder="+57 300...">
            </div>
            <div class="col-sm-6">
              <label class="form-label">Correo Electrónico</label>
              <input formControlName="email" type="email" class="form-control" placeholder="ejemplo@correo.com">
            </div>
            <div class="col-sm-6">
              <label class="form-label">Dirección</label>
              <input formControlName="address" type="text" class="form-control" placeholder="Calle, ciudad...">
            </div>
          </div>
          <div class="d-flex gap-2 mt-4">
            <button type="submit" class="btn btn-primary px-4" [disabled]="saving">
              <span *ngIf="saving" class="spinner-border spinner-border-sm me-2"></span>
              <i *ngIf="!saving" class="bi bi-check-lg me-1"></i>{{ isEdit ? 'Actualizar' : 'Crear' }}
            </button>
            <a routerLink="/persons" class="btn btn-outline-secondary">Cancelar</a>
          </div>
        </form>
      </div>
    </div>
  `
})
export class PersonFormComponent implements OnInit {
  form!: FormGroup; isEdit = false; personId!: number; saving = false;
  alertMsg = ''; alertType: 'success'|'danger' = 'success';

  constructor(private fb: FormBuilder, private personService: PersonService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      firstName: ['', [Validators.required, Validators.maxLength(100)]],
      lastName: ['', [Validators.required, Validators.maxLength(100)]],
      documentType: [''],
      documentNumber: ['', Validators.required],
      birthDate: [''],
      gender: [''],
      phone: ['', Validators.maxLength(20)],
      email: ['', Validators.email],
      address: ['', Validators.maxLength(150)]
    });
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true; this.personId = +id;
      this.personService.getById(this.personId).subscribe({ next: (d) => this.form.patchValue(d) });
    }
  }

  isInvalid(f: string): boolean { const c = this.form.get(f); return !!(c && c.invalid && c.touched); }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;
    const action = this.isEdit ? this.personService.update(this.personId, this.form.value) : this.personService.create(this.form.value);
    action.subscribe({
      next: () => this.router.navigate(['/persons']),
      error: () => { this.showAlert('Operación fallida.', 'danger'); this.saving = false; }
    });
  }

  showAlert(msg: string, type: 'success'|'danger'): void { this.alertMsg = msg; this.alertType = type; setTimeout(() => { this.alertMsg = ''; }, 3500); }
}
