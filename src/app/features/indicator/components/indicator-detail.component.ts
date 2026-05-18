import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IndicatorService } from '../../../core/services/indicator.service';
import { GoalService } from '../../../core/services/goal.service';
import { Indicator } from '../../../core/models/models';

@Component({
  selector: 'app-indicator-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page-header fade-in">
      <div><p class="text-muted mb-0" style="font-size:0.8rem">Indicadores</p><h2>Detalle del Indicador</h2></div>
      <div class="d-flex gap-2">
        <a [routerLink]="['/indicators/edit', indicator?.id]" class="btn btn-primary"><i class="bi bi-pencil me-1"></i>Editar</a>
        <a routerLink="/indicators" class="btn btn-outline-secondary"><i class="bi bi-arrow-left me-1"></i>Atrás</a>
      </div>
    </div>
    <div class="card fade-in" style="max-width:580px" *ngIf="indicator">
      <div class="card-header"><h5><i class="bi bi-bar-chart-line-fill me-2"></i>{{ indicator.indicatorName }}</h5></div>
      <div class="card-body">
        <dl class="row mb-0">
          <dt class="col-sm-5 text-muted" style="font-size:0.8rem">ID</dt><dd class="col-sm-7">{{ indicator.id }}</dd>
          <dt class="col-sm-5 text-muted" style="font-size:0.8rem">Objetivo</dt><dd class="col-sm-7">{{ goalCode }}</dd>
          <dt class="col-sm-5 text-muted" style="font-size:0.8rem">Nombre</dt><dd class="col-sm-7 fw-semibold">{{ indicator.indicatorName }}</dd>
          <dt class="col-sm-5 text-muted" style="font-size:0.8rem">Unidad de Medida</dt><dd class="col-sm-7">{{ indicator.measurementUnit || '—' }}</dd>
        </dl>
      </div>
    </div>
    <div *ngIf="loading" class="text-muted"><div class="spinner-border spinner-border-sm me-2"></div>Cargando...</div>
  `
})
export class IndicatorDetailComponent implements OnInit {
  indicator: Indicator | null = null; goalCode = ''; loading = true;
  constructor(private indicatorService: IndicatorService, private goalService: GoalService, private route: ActivatedRoute) {}
  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.indicatorService.getById(id).subscribe({
      next: (d) => {
        this.indicator = d; this.loading = false;
        this.goalService.getById(d.metaId).subscribe({ next: (g) => { this.goalCode = `${g.metaCode} — ${g.metaDescription}`; } });
      },
      error: () => { this.loading = false; }
    });
  }
}
