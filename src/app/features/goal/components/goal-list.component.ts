import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GoalService } from '../../../core/services/goal.service';
import { OdsService } from '../../../core/services/ods.service';
import { Goal, Ods } from '../../../core/models/models';
import { AlertComponent } from '../../../shared/components/alert.component';
import { PageHeaderComponent } from '../../../shared/components/page-header.component';

@Component({
  selector: 'app-goal-list',
  standalone: true,
  imports: [CommonModule, RouterLink, AlertComponent, PageHeaderComponent],
  template: `
    <app-page-header title="Goals" subtitle="Manage" actionLink="/goals/new" actionLabel="New Goal"></app-page-header>
    <app-alert [message]="alertMsg" [type]="alertType"></app-alert>
    <div class="card fade-in">
      <div class="card-header">
        <h5><i class="bi bi-flag-fill me-2"></i>Goal List</h5>
        <span class="badge bg-warning text-dark rounded-pill">{{ goals.length }} records</span>
      </div>
      <div class="card-body p-0">
        <div *ngIf="loading" class="text-center py-5 text-muted"><div class="spinner-border spinner-border-sm me-2"></div>Loading...</div>
        <div class="table-responsive" *ngIf="!loading">
          <table class="table table-hover align-middle mb-0">
            <thead>
              <tr>
                <th>#</th>
                <th>Code</th>
                <th>ODS</th>
                <th>Description</th>
                <th class="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let g of goals">
                <td class="text-muted" style="font-size:0.8rem">{{ g.id }}</td>
                <td><span class="badge" style="background:#fff3cd;color:#856404;font-weight:700">{{ g.metaCode }}</span></td>
                <td class="text-muted" style="font-size:0.82rem">{{ getOdsName(g.odsId) }}</td>
                <td style="max-width:260px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">{{ g.metaDescription }}</td>
                <td class="text-end">
                  <a [routerLink]="['/goals/detail', g.id]" class="btn btn-sm btn-outline-secondary me-1"><i class="bi bi-eye"></i></a>
                  <a [routerLink]="['/goals/edit', g.id]" class="btn btn-sm btn-outline-primary me-1"><i class="bi bi-pencil"></i></a>
                  <button class="btn btn-sm btn-outline-danger" (click)="confirmDelete(g)"><i class="bi bi-trash"></i></button>
                </td>
              </tr>
              <tr *ngIf="goals.length === 0"><td colspan="5" class="text-center text-muted py-4">No goals found.</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class GoalListComponent implements OnInit {
  goals: Goal[] = [];
  odsList: Ods[] = [];
  loading = true;
  alertMsg = ''; alertType: 'success'|'danger' = 'success';

  constructor(private goalService: GoalService, private odsService: OdsService) {}

  ngOnInit(): void {
    this.odsService.getAll().subscribe({ next: (d) => { this.odsList = d; } });
    this.load();
  }

  load(): void {
    this.loading = true;
    this.goalService.getAll().subscribe({
      next: (d) => { this.goals = d; this.loading = false; },
      error: () => { this.showAlert('Failed to load goals.', 'danger'); this.loading = false; }
    });
  }

  getOdsName(odsId: number): string {
    const ods = this.odsList.find(o => o.id === odsId);
    return ods ? `ODS ${ods.odsNumber} - ${ods.odsName}` : `ODS #${odsId}`;
  }

  confirmDelete(goal: Goal): void {
    if (confirm(`Delete goal "${goal.metaCode}"?`)) {
      this.goalService.delete(goal.id!).subscribe({
        next: () => { this.showAlert('Goal deleted.', 'success'); this.load(); },
        error: () => this.showAlert('Failed to delete.', 'danger')
      });
    }
  }

  showAlert(msg: string, type: 'success'|'danger'): void { this.alertMsg = msg; this.alertType = type; setTimeout(() => { this.alertMsg = ''; }, 3500); }
}
