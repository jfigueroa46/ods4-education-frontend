import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EducationalProgramService } from '../../../core/services/educational-program.service';
import { CountryService } from '../../../core/services/country.service';
import { EducationalInstitutionService } from '../../../core/services/educational-institution.service';
import { EducationalProgram } from '../../../core/models/models';

@Component({
  selector: 'app-program-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page-header fade-in">
      <div><p class="text-muted mb-0" style="font-size:0.8rem">Programs</p><h2>Program Detail</h2></div>
      <div class="d-flex gap-2">
        <a [routerLink]="['/educational-programs/edit', program?.id]" class="btn btn-primary">
          <i class="bi bi-pencil me-1"></i>Edit
        </a>
        <a routerLink="/educational-programs" class="btn btn-outline-secondary">
          <i class="bi bi-arrow-left me-1"></i>Back
        </a>
      </div>
    </div>

    <div class="card fade-in" style="max-width:620px" *ngIf="program">
      <div class="card-header">
        <h5><i class="bi bi-journal-bookmark-fill me-2"></i>{{ program.programName }}</h5>
      </div>
      <div class="card-body">
        <dl class="row mb-0">
          <dt class="col-sm-5 text-muted" style="font-size:0.8rem">ID</dt>
          <dd class="col-sm-7">{{ program.id }}</dd>

          <dt class="col-sm-5 text-muted" style="font-size:0.8rem">Country</dt>
          <dd class="col-sm-7">{{ countryName }}</dd>

          <dt class="col-sm-5 text-muted" style="font-size:0.8rem">Institution</dt>
          <dd class="col-sm-7">{{ institutionName }}</dd>

          <dt class="col-sm-5 text-muted" style="font-size:0.8rem">Program Name</dt>
          <dd class="col-sm-7 fw-semibold">{{ program.programName }}</dd>

          <dt class="col-sm-5 text-muted" style="font-size:0.8rem">Educational Level</dt>
          <dd class="col-sm-7">{{ program.educationalLevel || '—' }}</dd>

          <dt class="col-sm-5 text-muted" style="font-size:0.8rem">Beneficiaries</dt>
          <dd class="col-sm-7">{{ program.beneficiaries ?? '—' }}</dd>

          <dt class="col-sm-5 text-muted" style="font-size:0.8rem">Start Year</dt>
          <dd class="col-sm-7">{{ program.startYear || '—' }}</dd>
        </dl>
      </div>
    </div>

    <div *ngIf="loading" class="text-muted">
      <div class="spinner-border spinner-border-sm me-2"></div>Loading...
    </div>
  `
})
export class ProgramDetailComponent implements OnInit {
  program: EducationalProgram | null = null;
  countryName = '';
  institutionName = '';
  loading = true;

  constructor(
    private programService: EducationalProgramService,
    private countryService: CountryService,
    private instService: EducationalInstitutionService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.programService.getById(id).subscribe({
      next: (d) => {
        this.program = d;
        this.loading = false;
        this.countryService.getById(d.countryId).subscribe({ next: (c) => { this.countryName = c.countryName; } });
        this.instService.getById(d.institutionId).subscribe({ next: (i) => { this.institutionName = i.institutionName; } });
      },
      error: () => { this.loading = false; }
    });
  }
}
