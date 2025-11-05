import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardService } from 'src/app/services/dashboard.service';
import { ReservationService } from 'src/app/services/reservation.service';
import { CustomerService } from 'src/app/services/customer.service';
import { RoomService } from 'src/app/services/room.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { Reservation } from 'src/app/models/reservation.model';
import { Customer } from 'src/app/models/customer.model';
import { Room } from 'src/app/models/room.model';
import { Employee } from 'src/app/models/employee.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  stats = {
    totalCustomers: 0,
    totalEmployees: 0,
    totalRooms: 0,
    totalReservations: 0,
    activeReservations: 0,
    availableRooms: 0
  };

  recentReservations: Reservation[] = [];
  customers: Customer[] = [];
  rooms: Room[] = [];
  employees: Employee[] = [];

  constructor(
    private dashboardService: DashboardService,
    private reservationService: ReservationService,
    private customerService: CustomerService,
    private roomService: RoomService,
    private employeeService: EmployeeService
  ) { }

  ngOnInit(): void {
    this.loadDashboardData();
    // Cargar datos relacionados (customers, rooms, employees) como en el componente de reservas
    this.loadCustomers();
    this.loadRooms();
    this.loadEmployees();
  }

  private loadDashboardData(): void {
    console.log('Cargando datos del dashboard');
    
    // Cargar estadísticas del dashboard
    this.dashboardService.getDashboardStats().subscribe({
      next: (stats) => {
        console.log('Estadísticas del dashboard cargadas', stats);
        this.stats = stats;
      },
      error: (error) => {
        console.error('Error cargando estadísticas del dashboard:', error);
      }
    });
    
    // Cargar reservas recientes usando el mismo método que el componente de reservas
    this.loadRecentReservations();
  }

  private loadRecentReservations(): void {
    // Intentar primero con el método que incluye relaciones (igual que en reservations.component)
    this.reservationService.getReservationsWithRelations().subscribe({
      next: (reservations) => {
        console.log('Reservas cargadas con relaciones:', reservations);
        // Ordenar por fecha de inicio (más recientes primero) y tomar las primeras 5
        const sorted = (reservations || []).sort((a, b) => {
          const dateA = new Date(a.startDate).getTime();
          const dateB = new Date(b.startDate).getTime();
          return dateB - dateA;
        });
        this.recentReservations = sorted.slice(0, 5);
        // Asegurar que los datos relacionados estén cargados
        this.loadRelatedDataForReservations();
      },
      error: (error) => {
        console.warn('Error cargando reservas con relaciones, intentando método alternativo:', error);
        // Fallback al método original si el nuevo no funciona
        this.reservationService.getAllReservations().subscribe({
          next: (reservations) => {
            console.log('Reservas cargadas (método alternativo):', reservations);
            // Ordenar por fecha de inicio (más recientes primero) y tomar las primeras 5
            const sorted = (reservations || []).sort((a, b) => {
              const dateA = new Date(a.startDate).getTime();
              const dateB = new Date(b.startDate).getTime();
              return dateB - dateA;
            });
            this.recentReservations = sorted.slice(0, 5);
            // Cargar datos relacionados manualmente
            this.loadRelatedDataForReservations();
          },
          error: (fallbackError) => {
            console.error('Error loading reservations:', fallbackError);
            this.recentReservations = [];
          }
        });
      }
    });
  }

  private loadCustomers(): void {
    this.customerService.getAllCustomers().subscribe({
      next: (customers) => {
        this.customers = customers;
        // Si las reservas ya están cargadas, actualizar los datos relacionados
        this.loadRelatedDataForReservations();
      },
      error: (error) => console.error('Error loading customers:', error)
    });
  }

  private loadRooms(): void {
    this.roomService.getAllRooms().subscribe({
      next: (rooms) => {
        this.rooms = rooms;
        // Si las reservas ya están cargadas, actualizar los datos relacionados
        this.loadRelatedDataForReservations();
      },
      error: (error) => console.error('Error loading rooms:', error)
    });
  }

  private loadEmployees(): void {
    this.employeeService.getAllEmployees().subscribe({
      next: (employees) => {
        this.employees = employees;
        // Si las reservas ya están cargadas, actualizar los datos relacionados
        this.loadRelatedDataForReservations();
      },
      error: (error) => console.error('Error loading employees:', error)
    });
  }

  // Método auxiliar para cargar datos relacionados si no están disponibles (igual que en reservations.component)
  private loadRelatedDataForReservations(): void {
    this.recentReservations.forEach(reservation => {
      // Cargar datos del cliente si no están disponibles
      if (!reservation.customer && reservation.customerId) {
        const customer = this.customers.find(c => c.id === reservation.customerId);
        if (customer) {
          reservation.customer = customer;
        }
      }
      
      // Cargar datos de la habitación si no están disponibles
      if (!reservation.room && reservation.roomId) {
        const room = this.rooms.find(r => r.id === reservation.roomId);
        if (room) {
          reservation.room = room;
        }
      }
      
      // Cargar datos del empleado si no están disponibles
      if (!reservation.employee && reservation.employeeId) {
        const employee = this.employees.find(e => e.id === reservation.employeeId);
        if (employee) {
          reservation.employee = employee;
        }
      }
    });
  }
}
