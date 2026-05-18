import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PersonService } from '../../../core/services/person.service';
import { Person } from '../../../core/models/models';

@Component({
  selector: 'app-person-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page-header fade-in">
      <div><p class="text-muted mb-0" style="font-size:0.8rem">Personas</p><h2>Detalle de Persona</h2></div>
      <div class="d-flex gap-2">
        <a [routerLink]="['/persons/edit', person?.id]" class="btn btn-primary"><i class="bi bi-pencil me-1"></i>Editar</a>
        <a routerLink="/persons" class="btn btn-outline-secondary"><i class="bi bi-arrow-left me-1"></i>Atrás</a>
      </div>
    </div>
    <div class="card fade-in" style="max-width:600px" *ngIf="person">
      <div class="card-header">
        <h5><i class="bi bi-person-fill me-2"></i>{{ person.firstName }} {{ person.lastName }}</h5>
      </div>
      <div class="card-body">
        <dl class="row mb-0">
          <dt class="col-sm-5 text-muted" style="font-size:0.8rem">ID</dt><dd class="col-sm-7">{{ person.id }}</dd>
          <dt class="col-sm-5 text-muted" style="font-size:0.8rem">Documento</dt><dd class="col-sm-7">{{ person.documentType }} {{ person.documentNumber }}</dd>
          <dt class="col-sm-5 text-muted" style="font-size:0.8rem">Nombre Completo</dt><dd class="col-sm-7 fw-semibold">{{ person.firstName }} {{ person.lastName }}</dd>
          <dt class="col-sm-5 text-muted" style="font-size:0.8rem">Fecha de Nacimiento</dt><dd class="col-sm-7">{{ person.birthDate || '—' }}</dd>
          <dt class="col-sm-5 text-muted" style="font-size:0.8rem">Género</dt><dd class="col-sm-7">{{ person.gender || '—' }}</dd>
          <dt class="col-sm-5 text-muted" style="font-size:0.8rem">Teléfono</dt><dd class="col-sm-7">{{ person.phone || '—' }}</dd>
          <dt class="col-sm-5 text-muted" style="font-size:0.8rem">Correo</dt><dd class="col-sm-7">{{ person.email || '—' }}</dd>
          <dt class="col-sm-5 text-muted" style="font-size:0.8rem">Dirección</dt><dd class="col-sm-7">{{ person.address || '—' }}</dd>
        </dl>
      </div>
    </div>
    <div *ngIf="loading" class="text-muted"><div class="spinner-border spinner-border-sm me-2"></div>Cargando...</div>
  `
})
export class PersonDetailComponent implements OnInit {
  person: Person | null = null; loading = true;
  constructor(private personService: PersonService, private route: ActivatedRoute) {}
  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.personService.getById(id).subscribe({ next: (d) => { this.person = d; this.loading = false; }, error: () => { this.loading = false; } });
  }
}
