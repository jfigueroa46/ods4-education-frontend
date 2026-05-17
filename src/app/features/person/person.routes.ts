import { Routes } from '@angular/router';
export const personRoutes: Routes = [
  { path: '', loadComponent: () => import('./components/person-list.component').then(m => m.PersonListComponent) },
  { path: 'new', loadComponent: () => import('./components/person-form.component').then(m => m.PersonFormComponent) },
  { path: 'edit/:id', loadComponent: () => import('./components/person-form.component').then(m => m.PersonFormComponent) },
  { path: 'detail/:id', loadComponent: () => import('./components/person-detail.component').then(m => m.PersonDetailComponent) }
];
