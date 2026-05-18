import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EducationalInstitutionService } from '../../../core/services/educational-institution.service';
import { CountryService } from '../../../core/services/country.service';
import { EducationalInstitution } from '../../../core/models/models';

@Component({
  selector: 'app-institution-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page-header fade-in">
      <div><p class="text-muted mb-0" style="font-size:0.8rem">Instituciones</p><h2>Detalle de Institución</h2></div>
      <div class="d-flex gap-2">
        <a [routerLink]="['/educational-institutions/edit', institution?.id]" class="btn btn-primary">
          <i class="bi bi-pencil me-1"></i>Editar
        </a>
        <a routerLink="/educational-institutions" class="btn btn-outline-secondary">
          <i class="bi bi-arrow-left me-1"></i>Atrás
        </a>
      </div>
    </div>

    <div class="card fade-in" style="max-width:620px" *ngIf="institution">
      <div class="card-header">
        <h5><i class="bi bi-building-fill me-2"></i>{{ institution.institutionName }}</h5>
      </div>
      <div class="card-body">
        <dl class="row mb-0">
          <dt class="col-sm-5 text-muted" style="font-size:0.8rem">ID</dt>
          <dd class="col-sm-7">{{ institution.id }}</dd>

          <dt class="col-sm-5 text-muted" style="font-size:0.8rem">País</dt>
          <dd class="col-sm-7">{{ countryName }}</dd>

          <dt class="col-sm-5 text-muted" style="font-size:0.8rem">Nombre de la Institución</dt>
          <dd class="col-sm-7 fw-semibold">{{ institution.institutionName }}</dd>

          <dt class="col-sm-5 text-muted" style="font-size:0.8rem">Tipo</dt>
          <dd class="col-sm-7">{{ institution.institutionType || '—' }}</dd>

          <dt class="col-sm-5 text-muted" style="font-size:0.8rem">Acceso a Internet</dt>
          <dd class="col-sm-7">{{ institution.internetAccess || '—' }}</dd>

          <dt class="col-sm-5 text-muted" style="font-size:0.8rem">Cantidad de Estudiantes</dt>
          <dd class="col-sm-7">{{ institution.studentCount ?? '—' }}</dd>

          <dt class="col-sm-5 text-muted" style="font-size:0.8rem">Infraestructura</dt>
          <dd class="col-sm-7">{{ institution.infrastructureStatus || '—' }}</dd>
        </dl>
      </div>
    </div>

    <div *ngIf="loading" class="text-muted">
      <div class="spinner-border spinner-border-sm me-2"></div>Cargando...
    </div>
  `
})
export class InstitutionDetailComponent implements OnInit {
  institution: EducationalInstitution | null = null;
  countryName = '';
  loading = true;

  constructor(
    private instService: EducationalInstitutionService,
    private countryService: CountryService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.instService.getById(id).subscribe({
      next: (d) => {
        this.institution = d;
        this.loading = false;
        this.countryService.getById(d.countryId).subscribe({
          next: (c) => { this.countryName = c.countryName; }
        });
      },
      error: () => { this.loading = false; }
    });
  }
}
