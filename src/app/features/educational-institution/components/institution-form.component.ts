import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EducationalInstitutionService } from '../../../core/services/educational-institution.service';
import { CountryService } from '../../../core/services/country.service';
import { Country } from '../../../core/models/models';
import { AlertComponent } from '../../../shared/components/alert.component';

@Component({
  selector: 'app-institution-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, AlertComponent],
  template: `
    <div class="page-header fade-in">
      <div><p class="text-muted mb-0" style="font-size:0.8rem">Institutions</p><h2>{{ isEdit ? 'Edit Institution' : 'New Institution' }}</h2></div>
      <a routerLink="/educational-institutions" class="btn btn-outline-secondary"><i class="bi bi-arrow-left me-1"></i>Back</a>
    </div>
    <app-alert [message]="alertMsg" [type]="alertType"></app-alert>

    <div class="card fade-in" style="max-width:760px">
      <div class="card-header"><h5><i class="bi bi-building-fill me-2"></i>{{ isEdit ? 'Edit' : 'Create' }} Institution</h5></div>
      <div class="card-body p-4">
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="row g-3">

            <div class="col-12">
              <label class="form-label">Country <span class="text-danger">*</span></label>
              <select formControlName="countryId" class="form-select" [class.is-invalid]="isInvalid('countryId')">
                <option value="">— Select Country —</option>
                <option *ngFor="let c of countries" [value]="c.id">{{ c.countryName }}</option>
              </select>
              <div class="invalid-feedback">Please select a country.</div>
            </div>

            <div class="col-sm-8">
              <label class="form-label">Institution Name <span class="text-danger">*</span></label>
              <input formControlName="institutionName" type="text" class="form-control"
                     [class.is-invalid]="isInvalid('institutionName')" placeholder="e.g. Universidad Nacional">
              <div class="invalid-feedback">Name is required.</div>
            </div>

            <div class="col-sm-4">
              <label class="form-label">Institution Type</label>
              <select formControlName="institutionType" class="form-select">
                <option value="">— Select —</option>
                <option>Public</option>
                <option>Private</option>
                <option>Mixed</option>
              </select>
            </div>

            <div class="col-sm-6">
              <label class="form-label">Internet Access</label>
              <select formControlName="internetAccess" class="form-select">
                <option value="">— Select —</option>
                <option>Yes</option>
                <option>No</option>
                <option>Partial</option>
              </select>
            </div>

            <div class="col-sm-6">
              <label class="form-label">Student Count</label>
              <input formControlName="studentCount" type="number" class="form-control" placeholder="0" min="0">
            </div>

            <div class="col-12">
              <label class="form-label">Infrastructure Status</label>
              <select formControlName="infrastructureStatus" class="form-select">
                <option value="">— Select —</option>
                <option>Excellent</option>
                <option>Good</option>
                <option>Fair</option>
                <option>Poor</option>
              </select>
            </div>

          </div>

          <div class="d-flex gap-2 mt-4">
            <button type="submit" class="btn btn-primary px-4" [disabled]="saving">
              <span *ngIf="saving" class="spinner-border spinner-border-sm me-2"></span>
              <i *ngIf="!saving" class="bi bi-check-lg me-1"></i>
              {{ isEdit ? 'Update' : 'Create' }}
            </button>
            <a routerLink="/educational-institutions" class="btn btn-outline-secondary">Cancel</a>
          </div>

        </form>
      </div>
    </div>
  `
})
export class InstitutionFormComponent implements OnInit {
  form!: FormGroup;
  countries: Country[] = [];
  isEdit = false; institutionId!: number; saving = false;
  alertMsg = ''; alertType: 'success'|'danger' = 'success';

  constructor(
    private fb: FormBuilder,
    private instService: EducationalInstitutionService,
    private countryService: CountryService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      countryId:           ['', Validators.required],
      institutionName:     ['', [Validators.required, Validators.maxLength(150)]],
      institutionType:     [''],
      internetAccess:      [''],
      studentCount:        [null],
      infrastructureStatus:['']
    });

    this.countryService.getAll().subscribe({ next: (d) => { this.countries = d; } });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.institutionId = +id;
      this.instService.getById(this.institutionId).subscribe({ next: (d) => this.form.patchValue(d) });
    }
  }

  isInvalid(f: string): boolean {
    const c = this.form.get(f);
    return !!(c && c.invalid && c.touched);
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;
    const payload = { ...this.form.value, countryId: +this.form.value.countryId };
    const action = this.isEdit
      ? this.instService.update(this.institutionId, payload)
      : this.instService.create(payload);

    action.subscribe({
      next: () => this.router.navigate(['/educational-institutions']),
      error: () => { this.showAlert('Operation failed.', 'danger'); this.saving = false; }
    });
  }

  showAlert(msg: string, type: 'success'|'danger'): void {
    this.alertMsg = msg; this.alertType = type;
    setTimeout(() => { this.alertMsg = ''; }, 3500);
  }
}
