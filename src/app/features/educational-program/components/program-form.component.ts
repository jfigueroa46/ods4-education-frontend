import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EducationalProgramService } from '../../../core/services/educational-program.service';
import { CountryService } from '../../../core/services/country.service';
import { EducationalInstitutionService } from '../../../core/services/educational-institution.service';
import { Country, EducationalInstitution } from '../../../core/models/models';
import { AlertComponent } from '../../../shared/components/alert.component';

@Component({
  selector: 'app-program-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, AlertComponent],
  template: `
    <div class="page-header fade-in">
      <div><p class="text-muted mb-0" style="font-size:0.8rem">Programs</p><h2>{{ isEdit ? 'Edit Program' : 'New Program' }}</h2></div>
      <a routerLink="/educational-programs" class="btn btn-outline-secondary"><i class="bi bi-arrow-left me-1"></i>Back</a>
    </div>
    <app-alert [message]="alertMsg" [type]="alertType"></app-alert>

    <div class="card fade-in" style="max-width:760px">
      <div class="card-header"><h5><i class="bi bi-journal-bookmark-fill me-2"></i>{{ isEdit ? 'Edit' : 'Create' }} Program</h5></div>
      <div class="card-body p-4">
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="row g-3">

            <div class="col-sm-6">
              <label class="form-label">Country <span class="text-danger">*</span></label>
              <select formControlName="countryId" class="form-select" [class.is-invalid]="isInvalid('countryId')">
                <option value="">— Select Country —</option>
                <option *ngFor="let c of countries" [value]="c.id">{{ c.countryName }}</option>
              </select>
              <div class="invalid-feedback">Please select a country.</div>
            </div>

            <div class="col-sm-6">
              <label class="form-label">Institution <span class="text-danger">*</span></label>
              <select formControlName="institutionId" class="form-select" [class.is-invalid]="isInvalid('institutionId')">
                <option value="">— Select Institution —</option>
                <option *ngFor="let i of institutions" [value]="i.id">{{ i.institutionName }}</option>
              </select>
              <div class="invalid-feedback">Please select an institution.</div>
            </div>

            <div class="col-12">
              <label class="form-label">Program Name <span class="text-danger">*</span></label>
              <input formControlName="programName" type="text" class="form-control"
                     [class.is-invalid]="isInvalid('programName')" placeholder="e.g. Basic Education Program">
              <div class="invalid-feedback">Program name is required.</div>
            </div>

            <div class="col-sm-6">
              <label class="form-label">Educational Level</label>
              <select formControlName="educationalLevel" class="form-select">
                <option value="">— Select —</option>
                <option>Preschool</option>
                <option>Primary</option>
                <option>Secondary</option>
                <option>Higher Education</option>
                <option>Technical</option>
                <option>Postgraduate</option>
              </select>
            </div>

            <div class="col-sm-3">
              <label class="form-label">Beneficiaries</label>
              <input formControlName="beneficiaries" type="number" class="form-control" placeholder="0" min="0">
            </div>

            <div class="col-sm-3">
              <label class="form-label">Start Year</label>
              <input formControlName="startYear" type="number" class="form-control" placeholder="2024" min="1900" max="2100">
            </div>

          </div>

          <div class="d-flex gap-2 mt-4">
            <button type="submit" class="btn btn-primary px-4" [disabled]="saving">
              <span *ngIf="saving" class="spinner-border spinner-border-sm me-2"></span>
              <i *ngIf="!saving" class="bi bi-check-lg me-1"></i>
              {{ isEdit ? 'Update' : 'Create' }}
            </button>
            <a routerLink="/educational-programs" class="btn btn-outline-secondary">Cancel</a>
          </div>

        </form>
      </div>
    </div>
  `
})
export class ProgramFormComponent implements OnInit {
  form!: FormGroup;
  countries: Country[] = [];
  institutions: EducationalInstitution[] = [];
  isEdit = false; programId!: number; saving = false;
  alertMsg = ''; alertType: 'success'|'danger' = 'success';

  constructor(
    private fb: FormBuilder,
    private programService: EducationalProgramService,
    private countryService: CountryService,
    private instService: EducationalInstitutionService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      countryId:       ['', Validators.required],
      institutionId:   ['', Validators.required],
      programName:     ['', [Validators.required, Validators.maxLength(150)]],
      educationalLevel:[''],
      beneficiaries:   [null],
      startYear:       [null]
    });

    this.countryService.getAll().subscribe({ next: (d) => { this.countries = d; } });
    this.instService.getAll().subscribe({ next: (d) => { this.institutions = d; } });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.programId = +id;
      this.programService.getById(this.programId).subscribe({ next: (d) => this.form.patchValue(d) });
    }
  }

  isInvalid(f: string): boolean {
    const c = this.form.get(f);
    return !!(c && c.invalid && c.touched);
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;
    const payload = {
      ...this.form.value,
      countryId: +this.form.value.countryId,
      institutionId: +this.form.value.institutionId
    };
    const action = this.isEdit
      ? this.programService.update(this.programId, payload)
      : this.programService.create(payload);

    action.subscribe({
      next: () => this.router.navigate(['/educational-programs']),
      error: () => { this.showAlert('Operation failed.', 'danger'); this.saving = false; }
    });
  }

  showAlert(msg: string, type: 'success'|'danger'): void {
    this.alertMsg = msg; this.alertType = type;
    setTimeout(() => { this.alertMsg = ''; }, 3500);
  }
}
