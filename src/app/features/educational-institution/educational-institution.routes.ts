import { Routes } from '@angular/router';
export const educationalInstitutionRoutes: Routes = [
  { path: '', loadComponent: () => import('./components/institution-list.component').then(m => m.InstitutionListComponent) },
  { path: 'new', loadComponent: () => import('./components/institution-form.component').then(m => m.InstitutionFormComponent) },
  { path: 'edit/:id', loadComponent: () => import('./components/institution-form.component').then(m => m.InstitutionFormComponent) },
  { path: 'detail/:id', loadComponent: () => import('./components/institution-detail.component').then(m => m.InstitutionDetailComponent) }
];
