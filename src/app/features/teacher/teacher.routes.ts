import { Routes } from '@angular/router';
export const teacherRoutes: Routes = [
  { path: '', loadComponent: () => import('./components/teacher-list.component').then(m => m.TeacherListComponent) },
  { path: 'new', loadComponent: () => import('./components/teacher-form.component').then(m => m.TeacherFormComponent) },
  { path: 'edit/:id', loadComponent: () => import('./components/teacher-form.component').then(m => m.TeacherFormComponent) },
  { path: 'detail/:id', loadComponent: () => import('./components/teacher-detail.component').then(m => m.TeacherDetailComponent) }
];
