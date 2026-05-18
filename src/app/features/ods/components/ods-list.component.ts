import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { OdsService } from '../../../core/services/ods.service';
import { Ods } from '../../../core/models/models';
import { AlertComponent } from '../../../shared/components/alert.component';
import { PageHeaderComponent } from '../../../shared/components/page-header.component';

@Component({
  selector: 'app-ods-list',
  standalone: true,
  imports: [CommonModule, RouterLink, AlertComponent, PageHeaderComponent],
  template: `
    <app-page-header title="ODS" subtitle="Administrar" actionLink="/ods/new" actionLabel="Nuevo ODS"></app-page-header>
    <app-alert [message]="alertMsg" [type]="alertType"></app-alert>

    <div class="card fade-in">
      <div class="card-header">
        <h5><i class="bi bi-bullseye me-2"></i>Lista de ODS</h5>
        <span class="badge bg-success rounded-pill">{{ odsList.length }} registros</span>
      </div>
      <div class="card-body p-0">
        <div *ngIf="loading" class="text-center py-5 text-muted">
          <div class="spinner-border spinner-border-sm me-2"></div> Cargando...
        </div>
        <div class="table-responsive" *ngIf="!loading">
          <table class="table table-hover align-middle mb-0">
            <thead>
              <tr>
                <th>#</th>
                <th>Número</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th class="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let o of odsList">
                <td class="text-muted" style="font-size:0.8rem">{{ o.id }}</td>
                <td>
                  <span class="badge rounded-circle fw-bold" style="background:#1a7a4a;color:#fff;width:28px;height:28px;display:inline-flex;align-items:center;justify-content:center">
                    {{ o.odsNumber }}
                  </span>
                </td>
                <td class="fw-semibold">{{ o.odsName }}</td>
                <td class="text-muted" style="max-width:260px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">
                  {{ o.description || '—' }}
                </td>
                <td class="text-end">
                  <a [routerLink]="['/ods/detail', o.id]" class="btn btn-sm btn-outline-secondary me-1"><i class="bi bi-eye"></i></a>
                  <a [routerLink]="['/ods/edit', o.id]" class="btn btn-sm btn-outline-primary me-1"><i class="bi bi-pencil"></i></a>
                  <button class="btn btn-sm btn-outline-danger" (click)="confirmDelete(o)"><i class="bi bi-trash"></i></button>
                </td>
              </tr>
              <tr *ngIf="odsList.length === 0">
                <td colspan="5" class="text-center text-muted py-4">No se encontraron ODS.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class OdsListComponent implements OnInit {
  odsList: Ods[] = [];
  loading = true;
  alertMsg = ''; alertType: 'success'|'danger' = 'success';

  constructor(private odsService: OdsService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.odsService.getAll().subscribe({
      next: (d) => { this.odsList = d; this.loading = false; },
      error: () => { this.showAlert('No se pudo cargar los ODS.', 'danger'); this.loading = false; }
    });
  }

  confirmDelete(ods: Ods): void {
    if (confirm(`¿Eliminar ODS "${ods.odsName}"?`)) {
      this.odsService.delete(ods.id!).subscribe({
        next: () => { this.showAlert('ODS eliminado.', 'success'); this.load(); },
        error: () => this.showAlert('No se pudo eliminar.', 'danger')
      });
    }
  }

  showAlert(msg: string, type: 'success'|'danger'): void {
    this.alertMsg = msg; this.alertType = type;
    setTimeout(() => { this.alertMsg = ''; }, 3500);
  }
}
