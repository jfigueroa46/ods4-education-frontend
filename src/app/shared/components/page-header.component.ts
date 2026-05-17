import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

/**
 * Reusable page header with title and optional action button.
 */
@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <div class="page-header fade-in">
      <div>
        <p class="text-muted mb-0" style="font-size:0.8rem">{{ subtitle }}</p>
        <h2>{{ title }}</h2>
      </div>
      <a *ngIf="actionLink" [routerLink]="actionLink" class="btn btn-primary">
        <i class="bi bi-plus-lg me-1"></i> {{ actionLabel }}
      </a>
    </div>
  `
})
export class PageHeaderComponent {
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() actionLink: string = '';
  @Input() actionLabel: string = 'New';
}
