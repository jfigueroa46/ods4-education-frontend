import { Routes } from '@angular/router';

export const goalRoutes: Routes = [
  { path: '', loadComponent: () => import('./components/goal-list.component').then(m => m.GoalListComponent) },
  { path: 'new', loadComponent: () => import('./components/goal-form.component').then(m => m.GoalFormComponent) },
  { path: 'edit/:id', loadComponent: () => import('./components/goal-form.component').then(m => m.GoalFormComponent) },
  { path: 'detail/:id', loadComponent: () => import('./components/goal-detail.component').then(m => m.GoalDetailComponent) }
];
