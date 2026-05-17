import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Reusable alert banner for success and error messages.
 * Usage: <app-alert [message]="msg" [type]="'success'|'danger'"></app-alert>
 */
@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="message" class="alert fade-in" [ngClass]="'alert-' + type" role="alert">
      <i class="bi me-2" [ngClass]="type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'"></i>
      {{ message }}
    </div>
  `
})
export class AlertComponent {
  @Input() message: string = '';
  @Input() type: 'success' | 'danger' = 'success';
}
