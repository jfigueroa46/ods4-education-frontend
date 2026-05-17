import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GoalService } from '../../../core/services/goal.service';
import { OdsService } from '../../../core/services/ods.service';
import { Goal, Ods } from '../../../core/models/models';

@Component({
  selector: 'app-goal-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page-header fade-in">
      <div><p class="text-muted mb-0" style="font-size:0.8rem">Goals</p><h2>Goal Detail</h2></div>
      <div class="d-flex gap-2">
        <a [routerLink]="['/goals/edit', goal?.id]" class="btn btn-primary"><i class="bi bi-pencil me-1"></i>Edit</a>
        <a routerLink="/goals" class="btn btn-outline-secondary"><i class="bi bi-arrow-left me-1"></i>Back</a>
      </div>
    </div>
    <div class="card fade-in" style="max-width:580px" *ngIf="goal">
      <div class="card-header"><h5><i class="bi bi-flag-fill me-2"></i>{{ goal.metaCode }}</h5></div>
      <div class="card-body">
        <dl class="row mb-0">
          <dt class="col-sm-4 text-muted" style="font-size:0.8rem">ID</dt><dd class="col-sm-8">{{ goal.id }}</dd>
          <dt class="col-sm-4 text-muted" style="font-size:0.8rem">ODS</dt><dd class="col-sm-8">{{ odsName }}</dd>
          <dt class="col-sm-4 text-muted" style="font-size:0.8rem">Code</dt><dd class="col-sm-8 fw-semibold">{{ goal.metaCode }}</dd>
          <dt class="col-sm-4 text-muted" style="font-size:0.8rem">Description</dt><dd class="col-sm-8">{{ goal.metaDescription }}</dd>
        </dl>
      </div>
    </div>
    <div *ngIf="loading" class="text-muted"><div class="spinner-border spinner-border-sm me-2"></div>Loading...</div>
  `
})
export class GoalDetailComponent implements OnInit {
  goal: Goal | null = null; odsName = ''; loading = true;
  constructor(private goalService: GoalService, private odsService: OdsService, private route: ActivatedRoute) {}
  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.goalService.getById(id).subscribe({
      next: (d) => {
        this.goal = d; this.loading = false;
        this.odsService.getById(d.odsId).subscribe({ next: (o: Ods) => { this.odsName = `ODS ${o.odsNumber} — ${o.odsName}`; } });
      },
      error: () => { this.loading = false; }
    });
  }
}
