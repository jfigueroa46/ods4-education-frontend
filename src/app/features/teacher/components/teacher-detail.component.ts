import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TeacherService } from '../../../core/services/teacher.service';
import { PersonService } from '../../../core/services/person.service';
import { EducationalInstitutionService } from '../../../core/services/educational-institution.service';
import { Teacher } from '../../../core/models/models';

@Component({
  selector: 'app-teacher-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page-header fade-in">
      <div><p class="text-muted mb-0" style="font-size:0.8rem">Teachers</p><h2>Teacher Detail</h2></div>
      <div class="d-flex gap-2">
        <a [routerLink]="['/teachers/edit', teacher?.id]" class="btn btn-primary"><i class="bi bi-pencil me-1"></i>Edit</a>
        <a routerLink="/teachers" class="btn btn-outline-secondary"><i class="bi bi-arrow-left me-1"></i>Back</a>
      </div>
    </div>

    <div class="card fade-in" style="max-width:620px" *ngIf="teacher">
      <div class="card-header">
        <h5><i class="bi bi-person-workspace me-2"></i>{{ personName || 'Teacher #' + teacher.id }}</h5>
      </div>
      <div class="card-body">
        <dl class="row mb-0">
          <dt class="col-sm-5 text-muted" style="font-size:0.8rem">ID</dt>
          <dd class="col-sm-7">{{ teacher.id }}</dd>

          <dt class="col-sm-5 text-muted" style="font-size:0.8rem">Person</dt>
          <dd class="col-sm-7 fw-semibold">{{ personName }}</dd>

          <dt class="col-sm-5 text-muted" style="font-size:0.8rem">Institution</dt>
          <dd class="col-sm-7">{{ institutionName }}</dd>

          <dt class="col-sm-5 text-muted" style="font-size:0.8rem">Specialty</dt>
          <dd class="col-sm-7">{{ teacher.specialty || '—' }}</dd>

          <dt class="col-sm-5 text-muted" style="font-size:0.8rem">Education Level</dt>
          <dd class="col-sm-7">{{ teacher.educationLevel || '—' }}</dd>

          <dt class="col-sm-5 text-muted" style="font-size:0.8rem">Hiring Date</dt>
          <dd class="col-sm-7">{{ teacher.hiringDate || '—' }}</dd>

          <dt class="col-sm-5 text-muted" style="font-size:0.8rem">Salary</dt>
          <dd class="col-sm-7">
            <span *ngIf="teacher.salary">$ {{ teacher.salary | number:'1.2-2' }}</span>
            <span *ngIf="!teacher.salary">—</span>
          </dd>
        </dl>
      </div>
    </div>

    <div *ngIf="loading" class="text-muted">
      <div class="spinner-border spinner-border-sm me-2"></div>Loading...
    </div>
  `
})
export class TeacherDetailComponent implements OnInit {
  teacher: Teacher | null = null;
  personName = '';
  institutionName = '';
  loading = true;

  constructor(
    private teacherService: TeacherService,
    private personService: PersonService,
    private instService: EducationalInstitutionService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.teacherService.getById(id).subscribe({
      next: (d) => {
        this.teacher = d;
        this.loading = false;
        this.personService.getById(d.personId).subscribe({ next: (p) => { this.personName = `${p.firstName} ${p.lastName}`; } });
        this.instService.getById(d.institutionId).subscribe({ next: (i) => { this.institutionName = i.institutionName; } });
      },
      error: () => { this.loading = false; }
    });
  }
}
