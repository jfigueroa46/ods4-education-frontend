import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IndicatorService } from '../../../core/services/indicator.service';
import { GoalService } from '../../../core/services/goal.service';
import { Indicator, Goal } from '../../../core/models/models';
import { AlertComponent } from '../../../shared/components/alert.component';
import { PageHeaderComponent } from '../../../shared/components/page-header.component';

@Component({
  selector: 'app-indicator-list',
  standalone: true,
  imports: [CommonModule, RouterLink, AlertComponent, PageHeaderComponent],
  template: `
    <app-page-header title="Indicadores" subtitle="Administrar" actionLink="/indicators/new" actionLabel="Nuevo Indicador"></app-page-header>
    <app-alert [message]="alertMsg" [type]="alertType"></app-alert>
    <div class="card fade-in">
      <div class="card-header">
        <h5><i class="bi bi-bar-chart-line-fill me-2"></i>Lista de Indicadores</h5>
        <span class="badge bg-purple rounded-pill" style="background:#7b3fa0!important">{{ indicators.length }} registros</span>
      </div>
      <div class="card-body p-0">
        <div *ngIf="loading" class="text-center py-5 text-muted"><div class="spinner-border spinner-border-sm me-2"></div>Cargando...</div>
        <div class="table-responsive" *ngIf="!loading">
          <table class="table table-hover align-middle mb-0">
            <thead><tr><th>#</th><th>Nombre</th><th>Objetivo</th><th>Unidad</th><th class="text-end">Acciones</th></tr></thead>
            <tbody>
              <tr *ngFor="let i of indicators">
                <td class="text-muted" style="font-size:0.8rem">{{ i.id }}</td>
                <td class="fw-semibold">{{ i.indicatorName }}</td>
                <td class="text-muted" style="font-size:0.82rem">{{ getGoalCode(i.metaId) }}</td>
                <td><span class="badge" style="background:#f3e8ff;color:#7b3fa0;font-weight:600">{{ i.measurementUnit || '—' }}</span></td>
                <td class="text-end">
                  <a [routerLink]="['/indicators/detail', i.id]" class="btn btn-sm btn-outline-secondary me-1"><i class="bi bi-eye"></i></a>
                  <a [routerLink]="['/indicators/edit', i.id]" class="btn btn-sm btn-outline-primary me-1"><i class="bi bi-pencil"></i></a>
                  <button class="btn btn-sm btn-outline-danger" (click)="confirmDelete(i)"><i class="bi bi-trash"></i></button>
                </td>
              </tr>
              <tr *ngIf="indicators.length === 0"><td colspan="5" class="text-center text-muted py-4">No se encontraron indicadores.</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class IndicatorListComponent implements OnInit {
  indicators: Indicator[] = []; goals: Goal[] = [];
  loading = true; alertMsg = ''; alertType: 'success'|'danger' = 'success';

  constructor(private indicatorService: IndicatorService, private goalService: GoalService) {}

  ngOnInit(): void {
    this.goalService.getAll().subscribe({ next: (d) => { this.goals = d; } });
    this.load();
  }

  load(): void {
    this.loading = true;
    this.indicatorService.getAll().subscribe({
      next: (d) => { this.indicators = d; this.loading = false; },
      error: () => { this.showAlert('No se pudo cargar los indicadores.', 'danger'); this.loading = false; }
    });
  }

  getGoalCode(metaId: number): string {
    const g = this.goals.find(g => g.id === metaId);
    return g ? g.metaCode : `Objetivo #${metaId}`;
  }

  confirmDelete(ind: Indicator): void {
    if (confirm(`¿Eliminar indicador "${ind.indicatorName}"?`)) {
      this.indicatorService.delete(ind.id!).subscribe({
        next: () => { this.showAlert('Eliminado.', 'success'); this.load(); },
        error: () => this.showAlert('No se pudo eliminar.', 'danger')
      });
    }
  }

  showAlert(msg: string, type: 'success'|'danger'): void { this.alertMsg = msg; this.alertType = type; setTimeout(() => { this.alertMsg = ''; }, 3500); }
}
