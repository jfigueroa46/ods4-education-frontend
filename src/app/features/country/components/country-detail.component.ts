import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CountryService } from '../../../core/services/country.service';
import { Country } from '../../../core/models/models';

/**
 * Read-only detail view for a single Country.
 */
@Component({
  selector: 'app-country-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page-header fade-in">
      <div>
        <p class="text-muted mb-0" style="font-size:0.8rem">Países</p>
        <h2>Detalle del País</h2>
      </div>
      <div class="d-flex gap-2">
        <a [routerLink]="['/countries/edit', country?.id]" class="btn btn-primary">
          <i class="bi bi-pencil me-1"></i> Editar
        </a>
        <a routerLink="/countries" class="btn btn-outline-secondary">
          <i class="bi bi-arrow-left me-1"></i> Atrás
        </a>
      </div>
    </div>

    <div class="card fade-in" style="max-width:560px" *ngIf="country">
      <div class="card-header">
        <h5><i class="bi bi-globe-americas me-2"></i>{{ country.countryName }}</h5>
      </div>
      <div class="card-body">
        <dl class="row mb-0">
          <dt class="col-sm-4 text-muted" style="font-size:0.8rem">ID</dt>
          <dd class="col-sm-8">{{ country.id }}</dd>

          <dt class="col-sm-4 text-muted" style="font-size:0.8rem">Nombre del País</dt>
          <dd class="col-sm-8 fw-semibold">{{ country.countryName }}</dd>

          <dt class="col-sm-4 text-muted" style="font-size:0.8rem">Región</dt>
          <dd class="col-sm-8">{{ country.region || '—' }}</dd>
        </dl>
      </div>
    </div>

    <div *ngIf="!country && !loading" class="alert alert-danger">País no encontrado.</div>
    <div *ngIf="loading" class="text-muted">
      <div class="spinner-border spinner-border-sm me-2"></div> Cargando...
    </div>
  `
})
export class CountryDetailComponent implements OnInit {
  country: Country | null = null;
  loading = true;

  constructor(
    private countryService: CountryService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.countryService.getById(id).subscribe({
      next: (data) => { this.country = data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }
}
