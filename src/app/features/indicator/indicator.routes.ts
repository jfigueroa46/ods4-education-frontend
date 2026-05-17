import { Routes } from '@angular/router';
export const indicatorRoutes: Routes = [
  { path: '', loadComponent: () => import('./components/indicator-list.component').then(m => m.IndicatorListComponent) },
  { path: 'new', loadComponent: () => import('./components/indicator-form.component').then(m => m.IndicatorFormComponent) },
  { path: 'edit/:id', loadComponent: () => import('./components/indicator-form.component').then(m => m.IndicatorFormComponent) },
  { path: 'detail/:id', loadComponent: () => import('./components/indicator-detail.component').then(m => m.IndicatorDetailComponent) }
];
