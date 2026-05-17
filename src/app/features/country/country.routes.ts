import { Routes } from '@angular/router';

export const countryRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/country-list.component').then(m => m.CountryListComponent)
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./components/country-form.component').then(m => m.CountryFormComponent)
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('./components/country-form.component').then(m => m.CountryFormComponent)
  },
  {
    path: 'detail/:id',
    loadComponent: () =>
      import('./components/country-detail.component').then(m => m.CountryDetailComponent)
  }
];
