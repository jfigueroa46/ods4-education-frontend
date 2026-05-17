import { Routes } from '@angular/router';
export const educationalProgramRoutes: Routes = [
  { path: '', loadComponent: () => import('./components/program-list.component').then(m => m.ProgramListComponent) },
  { path: 'new', loadComponent: () => import('./components/program-form.component').then(m => m.ProgramFormComponent) },
  { path: 'edit/:id', loadComponent: () => import('./components/program-form.component').then(m => m.ProgramFormComponent) },
  { path: 'detail/:id', loadComponent: () => import('./components/program-detail.component').then(m => m.ProgramDetailComponent) }
];
