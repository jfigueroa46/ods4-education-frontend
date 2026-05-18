import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PersonService } from '../../../core/services/person.service';
import { Person } from '../../../core/models/models';
import { AlertComponent } from '../../../shared/components/alert.component';
import { PageHeaderComponent } from '../../../shared/components/page-header.component';

@Component({
  selector: 'app-person-list',
  standalone: true,
  imports: [CommonModule, RouterLink, AlertComponent, PageHeaderComponent],
  template: `
    <app-page-header title="Personas" subtitle="Administrar" actionLink="/persons/new" actionLabel="Nueva Persona"></app-page-header>
    <app-alert [message]="alertMsg" [type]="alertType"></app-alert>
    <div class="card fade-in">
      <div class="card-header">
        <h5><i class="bi bi-person-fill me-2"></i>Lista de Personas</h5>
        <span class="badge bg-secondary rounded-pill">{{ persons.length }} registros</span>
      </div>
      <div class="card-body p-0">
        <div *ngIf="loading" class="text-center py-5 text-muted"><div class="spinner-border spinner-border-sm me-2"></div>Cargando...</div>
        <div class="table-responsive" *ngIf="!loading">
          <table class="table table-hover align-middle mb-0">
            <thead><tr><th>#</th><th>Nombre Completo</th><th>Documento</th><th>Correo</th><th>Género</th><th class="text-end">Acciones</th></tr></thead>
            <tbody>
              <tr *ngFor="let p of persons">
                <td class="text-muted" style="font-size:0.8rem">{{ p.id }}</td>
                <td class="fw-semibold">{{ p.firstName }} {{ p.lastName }}</td>
                <td class="text-muted" style="font-size:0.82rem">{{ p.documentType }} {{ p.documentNumber }}</td>
                <td style="font-size:0.82rem">{{ p.email || '—' }}</td>
                <td>
                  <span class="badge rounded-pill" style="background:#e2e8f0;color:#4a5568;font-weight:600">{{ p.gender || '—' }}</span>
                </td>
                <td class="text-end">
                  <a [routerLink]="['/persons/detail', p.id]" class="btn btn-sm btn-outline-secondary me-1"><i class="bi bi-eye"></i></a>
                  <a [routerLink]="['/persons/edit', p.id]" class="btn btn-sm btn-outline-primary me-1"><i class="bi bi-pencil"></i></a>
                  <button class="btn btn-sm btn-outline-danger" (click)="confirmDelete(p)"><i class="bi bi-trash"></i></button>
                </td>
              </tr>
              <tr *ngIf="persons.length === 0"><td colspan="6" class="text-center text-muted py-4">No se encontraron personas.</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class PersonListComponent implements OnInit {
  persons: Person[] = []; loading = true;
  alertMsg = ''; alertType: 'success'|'danger' = 'success';

  constructor(private personService: PersonService) {}
  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.personService.getAll().subscribe({
      next: (d) => { this.persons = d; this.loading = false; },
      error: () => { this.showAlert('No se pudo cargar las personas.', 'danger'); this.loading = false; }
    });
  }

  confirmDelete(p: Person): void {
    if (confirm(`¿Eliminar "${p.firstName} ${p.lastName}"?`)) {
      this.personService.delete(p.id!).subscribe({
        next: () => { this.showAlert('Persona eliminada.', 'success'); this.load(); },
        error: () => this.showAlert('No se pudo eliminar.', 'danger')
      });
    }
  }

  showAlert(msg: string, type: 'success'|'danger'): void { this.alertMsg = msg; this.alertType = type; setTimeout(() => { this.alertMsg = ''; }, 3500); }
}
