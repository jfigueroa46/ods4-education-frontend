import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StudentService } from '../../../core/services/student.service';
import { PersonService } from '../../../core/services/person.service';
import { EducationalInstitutionService } from '../../../core/services/educational-institution.service';
import { EducationalProgramService } from '../../../core/services/educational-program.service';
import { Person, EducationalInstitution, EducationalProgram } from '../../../core/models/models';
import { AlertComponent } from '../../../shared/components/alert.component';

@Component({
  selector: 'app-student-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, AlertComponent],
  template: `
    <div class="page-header fade-in">
      <div><p class="text-muted mb-0" style="font-size:0.8rem">Students</p><h2>{{ isEdit ? 'Edit Student' : 'New Student' }}</h2></div>
      <a routerLink="/students" class="btn btn-outline-secondary"><i class="bi bi-arrow-left me-1"></i>Back</a>
    </div>
    <app-alert [message]="alertMsg" [type]="alertType"></app-alert>

    <div class="card fade-in" style="max-width:760px">
      <div class="card-header"><h5><i class="bi bi-person-video2 me-2"></i>{{ isEdit ? 'Edit' : 'Create' }} Student</h5></div>
      <div class="card-body p-4">
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="row g-3">

            <div class="col-sm-6">
              <label class="form-label">Person <span class="text-danger">*</span></label>
              <select formControlName="personId" class="form-select" [class.is-invalid]="isInvalid('personId')">
                <option value="">— Select Person —</option>
                <option *ngFor="let p of persons" [value]="p.id">{{ p.firstName }} {{ p.lastName }} ({{ p.documentNumber }})</option>
              </select>
              <div class="invalid-feedback">Please select a person.</div>
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
              <label class="form-label">Program <span class="text-danger">*</span></label>
              <select formControlName="programId" class="form-select" [class.is-invalid]="isInvalid('programId')">
                <option value="">— Select Program —</option>
                <option *ngFor="let p of programs" [value]="p.id">{{ p.programName }}</option>
              </select>
              <div class="invalid-feedback">Please select a program.</div>
            </div>

            <div class="col-sm-6">
              <label class="form-label">Student Code</label>
              <input formControlName="studentCode" type="text" class="form-control" placeholder="e.g. STU-2024-001">
            </div>

            <div class="col-sm-6">
              <label class="form-label">Grade</label>
              <input formControlName="grade" type="text" class="form-control" placeholder="e.g. 10th grade">
            </div>

            <div class="col-sm-6">
              <label class="form-label">Enrollment Date</label>
              <input formControlName="enrollmentDate" type="date" class="form-control">
            </div>

            <div class="col-sm-6">
              <label class="form-label">Academic Status</label>
              <select formControlName="academicStatus" class="form-select">
                <option value="">— Select —</option>
                <option>Active</option>
                <option>Graduated</option>
                <option>Suspended</option>
                <option>Withdrawn</option>
              </select>
            </div>

          </div>

          <div class="d-flex gap-2 mt-4">
            <button type="submit" class="btn btn-primary px-4" [disabled]="saving">
              <span *ngIf="saving" class="spinner-border spinner-border-sm me-2"></span>
              <i *ngIf="!saving" class="bi bi-check-lg me-1"></i>
              {{ isEdit ? 'Update' : 'Create' }}
            </button>
            <a routerLink="/students" class="btn btn-outline-secondary">Cancel</a>
          </div>

        </form>
      </div>
    </div>
  `
})
export class StudentFormComponent implements OnInit {
  form!: FormGroup;
  persons: Person[] = [];
  institutions: EducationalInstitution[] = [];
  programs: EducationalProgram[] = [];
  isEdit = false; studentId!: number; saving = false;
  alertMsg = ''; alertType: 'success'|'danger' = 'success';

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private personService: PersonService,
    private instService: EducationalInstitutionService,
    private programService: EducationalProgramService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      personId:       ['', Validators.required],
      institutionId:  ['', Validators.required],
      programId:      ['', Validators.required],
      studentCode:    ['', Validators.maxLength(30)],
      grade:          ['', Validators.maxLength(50)],
      enrollmentDate: [''],
      academicStatus: ['']
    });

    this.personService.getAll().subscribe({ next: (d) => { this.persons = d; } });
    this.instService.getAll().subscribe({ next: (d) => { this.institutions = d; } });
    this.programService.getAll().subscribe({ next: (d) => { this.programs = d; } });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.studentId = +id;
      this.studentService.getById(this.studentId).subscribe({ next: (d) => this.form.patchValue(d) });
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
      personId: +this.form.value.personId,
      institutionId: +this.form.value.institutionId,
      programId: +this.form.value.programId
    };
    const action = this.isEdit
      ? this.studentService.update(this.studentId, payload)
      : this.studentService.create(payload);

    action.subscribe({
      next: () => this.router.navigate(['/students']),
      error: () => { this.showAlert('Operation failed.', 'danger'); this.saving = false; }
    });
  }

  showAlert(msg: string, type: 'success'|'danger'): void {
    this.alertMsg = msg; this.alertType = type;
    setTimeout(() => { this.alertMsg = ''; }, 3500);
  }
}
