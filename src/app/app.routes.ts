import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';


export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/landing/landing.component').then(m => m.LandingComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'process',
    loadComponent: () => import('./components/service-process/service-process.component').then(m => m.ServiceProcessComponent)
  },
  {
    path: 'dashboard',
    canMatch: [authGuard],
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'customers',
    canMatch: [authGuard],
    loadComponent: () => import('./components/customers/customers.component').then(m => m.CustomersComponent)
  },
  {
    path: 'employees',
    canMatch: [authGuard],
    loadComponent: () => import('./components/employees/employees.component').then(m => m.EmployeesComponent)
  },
  {
    path: 'rooms',
    canMatch: [authGuard],
    loadComponent: () => import('./components/rooms/rooms.component').then(m => m.RoomsComponent)
  },
  {
    path: 'services',
    canMatch: [authGuard],
    loadComponent: () => import('./components/services/services.component').then(m => m.ServicesComponent)
  },
  {
    path: 'reservations',
    canMatch: [authGuard],
    loadComponent: () => import('./components/reservations/reservations.component').then(m => m.ReservationsComponent)
  },
  {
    path: 'confirm-reservation',
    loadComponent: () => import('./components/confirm-reservation/confirm-reservation.component').then(m => m.ConfirmReservationComponent)
  },
  {
    path: 'payment-success',
    loadComponent: () => import('./components/payment-success/payment-success.component').then(m => m.PaymentSuccessComponent)
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];
