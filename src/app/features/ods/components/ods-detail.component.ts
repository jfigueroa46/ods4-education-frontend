import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { OdsService } from '../../../core/services/ods.service';
import { Ods } from '../../../core/models/models';

@Component({
  selector: 'app-ods-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page-header fade-in">
      <div><p class="text-muted mb-0" style="font-size:0.8rem">ODS</p><h2>ODS Detail</h2></div>
      <div class="d-flex gap-2">
        <a [routerLink]="['/ods/edit', ods?.id]" class="btn btn-primary"><i class="bi bi-pencil me-1"></i>Edit</a>
        <a routerLink="/ods" class="btn btn-outline-secondary"><i class="bi bi-arrow-left me-1"></i>Back</a>
      </div>
    </div>
    <div class="card fade-in" style="max-width:580px" *ngIf="ods">
      <div class="card-header"><h5><i class="bi bi-bullseye me-2"></i>ODS {{ ods.odsNumber }}</h5></div>
      <div class="card-body">
        <dl class="row mb-0">
          <dt class="col-sm-4 text-muted" style="font-size:0.8rem">ID</dt><dd class="col-sm-8">{{ ods.id }}</dd>
          <dt class="col-sm-4 text-muted" style="font-size:0.8rem">Number</dt><dd class="col-sm-8">{{ ods.odsNumber }}</dd>
          <dt class="col-sm-4 text-muted" style="font-size:0.8rem">Name</dt><dd class="col-sm-8 fw-semibold">{{ ods.odsName }}</dd>
          <dt class="col-sm-4 text-muted" style="font-size:0.8rem">Description</dt><dd class="col-sm-8">{{ ods.description || '—' }}</dd>
        </dl>
      </div>
    </div>
    <div *ngIf="loading" class="text-muted"><div class="spinner-border spinner-border-sm me-2"></div>Loading...</div>
  `
})
export class OdsDetailComponent implements OnInit {
  ods: Ods | null = null; loading = true;
  constructor(private odsService: OdsService, private route: ActivatedRoute) {}
  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.odsService.getById(id).subscribe({ next: (d) => { this.ods = d; this.loading = false; }, error: () => { this.loading = false; } });
  }
}
