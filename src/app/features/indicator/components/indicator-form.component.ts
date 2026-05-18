import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IndicatorService } from '../../../core/services/indicator.service';
import { GoalService } from '../../../core/services/goal.service';
import { Goal } from '../../../core/models/models';
import { AlertComponent } from '../../../shared/components/alert.component';

@Component({
  selector: 'app-indicator-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, AlertComponent],
  template: `
    <div class="page-header fade-in">
      <div><p class="text-muted mb-0" style="font-size:0.8rem">Indicadores</p><h2>{{ isEdit ? 'Editar Indicador' : 'Nuevo Indicador' }}</h2></div>
      <a routerLink="/indicators" class="btn btn-outline-secondary"><i class="bi bi-arrow-left me-1"></i>Atrás</a>
    </div>
    <app-alert [message]="alertMsg" [type]="alertType"></app-alert>
    <div class="card fade-in" style="max-width:640px">
      <div class="card-header"><h5><i class="bi bi-bar-chart-line-fill me-2"></i>{{ isEdit ? 'Editar' : 'Crear' }} Indicador</h5></div>
      <div class="card-body p-4">
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="mb-3">
            <label class="form-label">Objetivo <span class="text-danger">*</span></label>
            <select formControlName="metaId" class="form-select" [class.is-invalid]="isInvalid('metaId')">
              <option value="">— Seleccionar Objetivo —</option>
              <option *ngFor="let g of goals" [value]="g.id">{{ g.metaCode }} — {{ g.metaDescription }}</option>
            </select>
            <div class="invalid-feedback">Por favor selecciona un objetivo.</div>
          </div>
          <div class="mb-3">
            <label class="form-label">Nombre del Indicador <span class="text-danger">*</span></label>
            <input formControlName="indicatorName" type="text" class="form-control" [class.is-invalid]="isInvalid('indicatorName')" placeholder="p. ej. Tasa de Alfabetización">
            <div class="invalid-feedback">El nombre es requerido.</div>
          </div>
          <div class="mb-4">
            <label class="form-label">Unidad de Medida</label>
            <input formControlName="measurementUnit" type="text" class="form-control" placeholder="p. ej. Porcentaje (%)">
          </div>
          <div class="d-flex gap-2">
            <button type="submit" class="btn btn-primary px-4" [disabled]="saving">
              <span *ngIf="saving" class="spinner-border spinner-border-sm me-2"></span>
              <i *ngIf="!saving" class="bi bi-check-lg me-1"></i>{{ isEdit ? 'Actualizar' : 'Crear' }}
            </button>
            <a routerLink="/indicators" class="btn btn-outline-secondary">Cancelar</a>
          </div>
        </form>
      </div>
    </div>
  `
})
export class IndicatorFormComponent implements OnInit {
  form!: FormGroup; goals: Goal[] = [];
  isEdit = false; indicatorId!: number; saving = false;
  alertMsg = ''; alertType: 'success'|'danger' = 'success';

  constructor(private fb: FormBuilder, private indicatorService: IndicatorService, private goalService: GoalService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      metaId: ['', Validators.required],
      indicatorName: ['', [Validators.required, Validators.maxLength(200)]],
      measurementUnit: ['', Validators.maxLength(50)]
    });
    this.goalService.getAll().subscribe({ next: (d) => { this.goals = d; } });
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true; this.indicatorId = +id;
      this.indicatorService.getById(this.indicatorId).subscribe({ next: (d) => this.form.patchValue(d) });
    }
  }

  isInvalid(f: string): boolean { const c = this.form.get(f); return !!(c && c.invalid && c.touched); }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;
    const payload = { ...this.form.value, metaId: +this.form.value.metaId };
    const action = this.isEdit ? this.indicatorService.update(this.indicatorId, payload) : this.indicatorService.create(payload);
    action.subscribe({
      next: () => this.router.navigate(['/indicators']),
      error: () => { this.showAlert('Operación fallida.', 'danger'); this.saving = false; }
    });
  }

  showAlert(msg: string, type: 'success'|'danger'): void { this.alertMsg = msg; this.alertType = type; setTimeout(() => { this.alertMsg = ''; }, 3500); }
}
