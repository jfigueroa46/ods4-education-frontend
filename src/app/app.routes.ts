import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./shared/layout/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'countries',
    loadChildren: () =>
      import('./features/country/country.routes').then(m => m.countryRoutes)
  },
  {
    path: 'ods',
    loadChildren: () =>
      import('./features/ods/ods.routes').then(m => m.odsRoutes)
  },
  {
    path: 'goals',
    loadChildren: () =>
      import('./features/goal/goal.routes').then(m => m.goalRoutes)
  },
  {
    path: 'indicators',
    loadChildren: () =>
      import('./features/indicator/indicator.routes').then(m => m.indicatorRoutes)
  },
  {
    path: 'persons',
    loadChildren: () =>
      import('./features/person/person.routes').then(m => m.personRoutes)
  },
  {
    path: 'educational-institutions',
    loadChildren: () =>
      import('./features/educational-institution/educational-institution.routes').then(m => m.educationalInstitutionRoutes)
  },
  {
    path: 'educational-programs',
    loadChildren: () =>
      import('./features/educational-program/educational-program.routes').then(m => m.educationalProgramRoutes)
  },
  {
    path: 'students',
    loadChildren: () =>
      import('./features/student/student.routes').then(m => m.studentRoutes)
  },
  {
    path: 'teachers',
    loadChildren: () =>
      import('./features/teacher/teacher.routes').then(m => m.teacherRoutes)
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
