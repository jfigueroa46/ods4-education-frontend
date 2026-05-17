import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StudentService } from '../../../core/services/student.service';
import { PersonService } from '../../../core/services/person.service';
import { EducationalInstitutionService } from '../../../core/services/educational-institution.service';
import { EducationalProgramService } from '../../../core/services/educational-program.service';
import { Student } from '../../../core/models/models';

@Component({
  selector: 'app-student-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page-header fade-in">
      <div><p class="text-muted mb-0" style="font-size:0.8rem">Students</p><h2>Student Detail</h2></div>
      <div class="d-flex gap-2">
        <a [routerLink]="['/students/edit', student?.id]" class="btn btn-primary"><i class="bi bi-pencil me-1"></i>Edit</a>
        <a routerLink="/students" class="btn btn-outline-secondary"><i class="bi bi-arrow-left me-1"></i>Back</a>
      </div>
    </div>

    <div class="card fade-in" style="max-width:620px" *ngIf="student">
      <div class="card-header">
        <h5><i class="bi bi-person-video2 me-2"></i>{{ student.studentCode || 'Student #' + student.id }}</h5>
      </div>
      <div class="card-body">
        <dl class="row mb-0">
          <dt class="col-sm-5 text-muted" style="font-size:0.8rem">ID</dt>
          <dd class="col-sm-7">{{ student.id }}</dd>

          <dt class="col-sm-5 text-muted" style="font-size:0.8rem">Person</dt>
          <dd class="col-sm-7">{{ personName }}</dd>

          <dt class="col-sm-5 text-muted" style="font-size:0.8rem">Institution</dt>
          <dd class="col-sm-7">{{ institutionName }}</dd>

          <dt class="col-sm-5 text-muted" style="font-size:0.8rem">Program</dt>
          <dd class="col-sm-7">{{ programName }}</dd>

          <dt class="col-sm-5 text-muted" style="font-size:0.8rem">Student Code</dt>
          <dd class="col-sm-7 fw-semibold" style="font-family:monospace">{{ student.studentCode || '—' }}</dd>

          <dt class="col-sm-5 text-muted" style="font-size:0.8rem">Grade</dt>
          <dd class="col-sm-7">{{ student.grade || '—' }}</dd>

          <dt class="col-sm-5 text-muted" style="font-size:0.8rem">Enrollment Date</dt>
          <dd class="col-sm-7">{{ student.enrollmentDate || '—' }}</dd>

          <dt class="col-sm-5 text-muted" style="font-size:0.8rem">Academic Status</dt>
          <dd class="col-sm-7">
            <span class="badge rounded-pill"
              [style.background]="student.academicStatus === 'Active' ? '#d1fae5' : '#fee2e2'"
              [style.color]="student.academicStatus === 'Active' ? '#065f46' : '#991b1b'">
              {{ student.academicStatus || '—' }}
            </span>
          </dd>
        </dl>
      </div>
    </div>

    <div *ngIf="loading" class="text-muted">
      <div class="spinner-border spinner-border-sm me-2"></div>Loading...
    </div>
  `
})
export class StudentDetailComponent implements OnInit {
  student: Student | null = null;
  personName = ''; institutionName = ''; programName = '';
  loading = true;

  constructor(
    private studentService: StudentService,
    private personService: PersonService,
    private instService: EducationalInstitutionService,
    private programService: EducationalProgramService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.studentService.getById(id).subscribe({
      next: (d) => {
        this.student = d;
        this.loading = false;
        this.personService.getById(d.personId).subscribe({ next: (p) => { this.personName = `${p.firstName} ${p.lastName}`; } });
        this.instService.getById(d.institutionId).subscribe({ next: (i) => { this.institutionName = i.institutionName; } });
        this.programService.getById(d.programId).subscribe({ next: (p) => { this.programName = p.programName; } });
      },
      error: () => { this.loading = false; }
    });
  }
}
