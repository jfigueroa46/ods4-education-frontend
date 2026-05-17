import { Routes } from '@angular/router';
export const studentRoutes: Routes = [
  { path: '', loadComponent: () => import('./components/student-list.component').then(m => m.StudentListComponent) },
  { path: 'new', loadComponent: () => import('./components/student-form.component').then(m => m.StudentFormComponent) },
  { path: 'edit/:id', loadComponent: () => import('./components/student-form.component').then(m => m.StudentFormComponent) },
  { path: 'detail/:id', loadComponent: () => import('./components/student-detail.component').then(m => m.StudentDetailComponent) }
];
