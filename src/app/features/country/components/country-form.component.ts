import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CountryService } from '../../../core/services/country.service';
import { AlertComponent } from '../../../shared/components/alert.component';

/**
 * Form component for creating and editing a Country.
 * Detects if an ID is in the route to switch between create/edit mode.
 */
@Component({
  selector: 'app-country-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, AlertComponent],
  template: `
    <div class="page-header fade-in">
      <div>
        <p class="text-muted mb-0" style="font-size:0.8rem">Countries</p>
        <h2>{{ isEdit ? 'Edit Country' : 'New Country' }}</h2>
      </div>
      <a routerLink="/countries" class="btn btn-outline-secondary">
        <i class="bi bi-arrow-left me-1"></i> Back
      </a>
    </div>

    <app-alert [message]="alertMsg" [type]="alertType"></app-alert>

    <div class="card fade-in" style="max-width:580px">
      <div class="card-header">
        <h5><i class="bi bi-globe-americas me-2"></i>{{ isEdit ? 'Edit' : 'Create' }} Country</h5>
      </div>
      <div class="card-body p-4">
        <form [formGroup]="form" (ngSubmit)="onSubmit()">

          <div class="mb-3">
            <label class="form-label">Country Name <span class="text-danger">*</span></label>
            <input formControlName="countryName" type="text" class="form-control"
                   [class.is-invalid]="isInvalid('countryName')" placeholder="e.g. Colombia">
            <div class="invalid-feedback">Name is required (min 2 characters).</div>
          </div>

          <div class="mb-4">
            <label class="form-label">Region</label>
            <input formControlName="region" type="text" class="form-control" placeholder="e.g. South America">
          </div>

          <div class="d-flex gap-2">
            <button type="submit" class="btn btn-primary px-4" [disabled]="saving">
              <span *ngIf="saving" class="spinner-border spinner-border-sm me-2"></span>
              <i *ngIf="!saving" class="bi bi-check-lg me-1"></i>
              {{ isEdit ? 'Update' : 'Create' }}
            </button>
            <a routerLink="/countries" class="btn btn-outline-secondary">Cancel</a>
          </div>

        </form>
      </div>
    </div>
  `
})
export class CountryFormComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  countryId!: number;
  saving = false;
  alertMsg = '';
  alertType: 'success' | 'danger' = 'success';

  constructor(
    private fb: FormBuilder,
    private countryService: CountryService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      countryName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      region: ['', [Validators.maxLength(100)]]
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.countryId = +id;
      this.countryService.getById(this.countryId).subscribe({
        next: (data) => this.form.patchValue(data),
        error: () => this.showAlert('Failed to load country data.', 'danger')
      });
    }
  }

  isInvalid(field: string): boolean {
    const ctrl = this.form.get(field);
    return !!(ctrl && ctrl.invalid && ctrl.touched);
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    this.saving = true;
    const payload = this.form.value;

    if (this.isEdit) {
      this.countryService.update(this.countryId, payload).subscribe({
        next: () => this.router.navigate(['/countries']),
        error: () => { this.showAlert('Failed to update country.', 'danger'); this.saving = false; }
      });
    } else {
      this.countryService.create(payload).subscribe({
        next: () => this.router.navigate(['/countries']),
        error: () => { this.showAlert('Failed to create country.', 'danger'); this.saving = false; }
      });
    }
  }

  showAlert(msg: string, type: 'success' | 'danger'): void {
    this.alertMsg = msg; this.alertType = type;
    setTimeout(() => { this.alertMsg = ''; }, 3500);
  }
}
