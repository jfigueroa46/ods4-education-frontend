import { Routes } from '@angular/router';

export const odsRoutes: Routes = [
  { path: '', loadComponent: () => import('./components/ods-list.component').then(m => m.OdsListComponent) },
  { path: 'new', loadComponent: () => import('./components/ods-form.component').then(m => m.OdsFormComponent) },
  { path: 'edit/:id', loadComponent: () => import('./components/ods-form.component').then(m => m.OdsFormComponent) },
  { path: 'detail/:id', loadComponent: () => import('./components/ods-detail.component').then(m => m.OdsDetailComponent) }
];
