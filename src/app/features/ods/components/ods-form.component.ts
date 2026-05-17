import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { OdsService } from '../../../core/services/ods.service';
import { AlertComponent } from '../../../shared/components/alert.component';

@Component({
  selector: 'app-ods-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, AlertComponent],
  template: `
    <div class="page-header fade-in">
      <div>
        <p class="text-muted mb-0" style="font-size:0.8rem">ODS</p>
        <h2>{{ isEdit ? 'Edit ODS' : 'New ODS' }}</h2>
      </div>
      <a routerLink="/ods" class="btn btn-outline-secondary"><i class="bi bi-arrow-left me-1"></i>Back</a>
    </div>
    <app-alert [message]="alertMsg" [type]="alertType"></app-alert>

    <div class="card fade-in" style="max-width:620px">
      <div class="card-header"><h5><i class="bi bi-bullseye me-2"></i>{{ isEdit ? 'Edit' : 'Create' }} ODS</h5></div>
      <div class="card-body p-4">
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="row g-3">
            <div class="col-sm-4">
              <label class="form-label">ODS Number <span class="text-danger">*</span></label>
              <input formControlName="odsNumber" type="number" class="form-control"
                     [class.is-invalid]="isInvalid('odsNumber')" placeholder="1-17">
              <div class="invalid-feedback">Number is required.</div>
            </div>
            <div class="col-sm-8">
              <label class="form-label">ODS Name <span class="text-danger">*</span></label>
              <input formControlName="odsName" type="text" class="form-control"
                     [class.is-invalid]="isInvalid('odsName')" placeholder="e.g. Quality Education">
              <div class="invalid-feedback">Name is required (min 3 chars).</div>
            </div>
            <div class="col-12">
              <label class="form-label">Description</label>
              <textarea formControlName="description" class="form-control" rows="3" placeholder="Brief description..."></textarea>
            </div>
          </div>
          <div class="d-flex gap-2 mt-4">
            <button type="submit" class="btn btn-primary px-4" [disabled]="saving">
              <span *ngIf="saving" class="spinner-border spinner-border-sm me-2"></span>
              <i *ngIf="!saving" class="bi bi-check-lg me-1"></i>
              {{ isEdit ? 'Update' : 'Create' }}
            </button>
            <a routerLink="/ods" class="btn btn-outline-secondary">Cancel</a>
          </div>
        </form>
      </div>
    </div>
  `
})
export class OdsFormComponent implements OnInit {
  form!: FormGroup;
  isEdit = false; odsId!: number; saving = false;
  alertMsg = ''; alertType: 'success'|'danger' = 'success';

  constructor(private fb: FormBuilder, private odsService: OdsService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      odsNumber: ['', [Validators.required, Validators.min(1), Validators.max(17)]],
      odsName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(150)]],
      description: ['']
    });
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true; this.odsId = +id;
      this.odsService.getById(this.odsId).subscribe({ next: (d) => this.form.patchValue(d) });
    }
  }

  isInvalid(f: string): boolean { const c = this.form.get(f); return !!(c && c.invalid && c.touched); }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;
    const payload = this.form.value;
    const action = this.isEdit ? this.odsService.update(this.odsId, payload) : this.odsService.create(payload);
    action.subscribe({
      next: () => this.router.navigate(['/ods']),
      error: () => { this.showAlert('Operation failed.', 'danger'); this.saving = false; }
    });
  }

  showAlert(msg: string, type: 'success'|'danger'): void { this.alertMsg = msg; this.alertType = type; setTimeout(() => { this.alertMsg = ''; }, 3500); }
}
