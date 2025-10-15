import { Routes } from '@angular/router';


export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/landing/landing.component').then(m => m.LandingComponent)
  },
  {
    path: 'process',
    loadComponent: () => import('./components/landing/service-process/service-process.component').then(m => m.ServiceProcessComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'customers',
    loadComponent: () => import('./components/customers/customers.component').then(m => m.CustomersComponent)
  },
  {
    path: 'employees',
    loadComponent: () => import('./components/employees/employees.component').then(m => m.EmployeesComponent)
  },
  {
    path: 'rooms',
    loadComponent: () => import('./components/rooms/rooms.component').then(m => m.RoomsComponent)
  },
  {
    path: 'services',
    loadComponent: () => import('./components/services/services.component').then(m => m.ServicesComponent)
  },
  {
    path: 'reservations',
    loadComponent: () => import('./components/reservations/reservations.component').then(m => m.ReservationsComponent)
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];
