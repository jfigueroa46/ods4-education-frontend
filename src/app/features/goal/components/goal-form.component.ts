import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GoalService } from '../../../core/services/goal.service';
import { OdsService } from '../../../core/services/ods.service';
import { Ods } from '../../../core/models/models';
import { AlertComponent } from '../../../shared/components/alert.component';

@Component({
  selector: 'app-goal-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, AlertComponent],
  template: `
    <div class="page-header fade-in">
      <div><p class="text-muted mb-0" style="font-size:0.8rem">Objetivos</p><h2>{{ isEdit ? 'Editar Objetivo' : 'Nuevo Objetivo' }}</h2></div>
      <a routerLink="/goals" class="btn btn-outline-secondary"><i class="bi bi-arrow-left me-1"></i>Atrás</a>
    </div>
    <app-alert [message]="alertMsg" [type]="alertType"></app-alert>
    <div class="card fade-in" style="max-width:640px">
      <div class="card-header"><h5><i class="bi bi-flag-fill me-2"></i>{{ isEdit ? 'Editar' : 'Crear' }} Objetivo</h5></div>
      <div class="card-body p-4">
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="mb-3">
            <label class="form-label">ODS <span class="text-danger">*</span></label>
            <select formControlName="odsId" class="form-select" [class.is-invalid]="isInvalid('odsId')">
              <option value="">— Seleccionar ODS —</option>
              <option *ngFor="let o of odsList" [value]="o.id">ODS {{ o.odsNumber }} — {{ o.odsName }}</option>
            </select>
            <div class="invalid-feedback">Por favor selecciona un ODS.</div>
          </div>
          <div class="mb-3">
            <label class="form-label">Código de Objetivo <span class="text-danger">*</span></label>
            <input formControlName="metaCode" type="text" class="form-control" [class.is-invalid]="isInvalid('metaCode')" placeholder="p. ej. 4.1">
            <div class="invalid-feedback">El código es requerido.</div>
          </div>
          <div class="mb-4">
            <label class="form-label">Descripción <span class="text-danger">*</span></label>
            <textarea formControlName="metaDescription" class="form-control" rows="3" [class.is-invalid]="isInvalid('metaDescription')" placeholder="Descripción del objetivo..."></textarea>
            <div class="invalid-feedback">La descripción es requerida.</div>
          </div>
          <div class="d-flex gap-2">
            <button type="submit" class="btn btn-primary px-4" [disabled]="saving">
              <span *ngIf="saving" class="spinner-border spinner-border-sm me-2"></span>
              <i *ngIf="!saving" class="bi bi-check-lg me-1"></i>{{ isEdit ? 'Actualizar' : 'Crear' }}
            </button>
            <a routerLink="/goals" class="btn btn-outline-secondary">Cancelar</a>
          </div>
        </form>
      </div>
    </div>
  `
})
export class GoalFormComponent implements OnInit {
  form!: FormGroup;
  odsList: Ods[] = [];
  isEdit = false; goalId!: number; saving = false;
  alertMsg = ''; alertType: 'success'|'danger' = 'success';

  constructor(private fb: FormBuilder, private goalService: GoalService, private odsService: OdsService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      odsId: ['', Validators.required],
      metaCode: ['', [Validators.required, Validators.maxLength(20)]],
      metaDescription: ['', Validators.required]
    });
    this.odsService.getAll().subscribe({ next: (d) => { this.odsList = d; } });
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true; this.goalId = +id;
      this.goalService.getById(this.goalId).subscribe({ next: (d) => this.form.patchValue(d) });
    }
  }

  isInvalid(f: string): boolean { const c = this.form.get(f); return !!(c && c.invalid && c.touched); }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;
    const payload = { ...this.form.value, odsId: +this.form.value.odsId };
    const action = this.isEdit ? this.goalService.update(this.goalId, payload) : this.goalService.create(payload);
    action.subscribe({
      next: () => this.router.navigate(['/goals']),
      error: () => { this.showAlert('Operation failed.', 'danger'); this.saving = false; }
    });
  }

  showAlert(msg: string, type: 'success'|'danger'): void { this.alertMsg = msg; this.alertType = type; setTimeout(() => { this.alertMsg = ''; }, 3500); }
}
