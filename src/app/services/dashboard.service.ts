import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map, switchMap } from 'rxjs';
import { Reservation } from '../models/reservation.model';
import { Customer } from '../models/customer.model';
import { Room } from '../models/room.model';
import { Employee } from '../models/employee.model';

export interface DashboardStats {
  totalCustomers: number;
  totalEmployees: number;
  totalRooms: number;
  totalReservations: number;
  activeReservations: number;
  availableRooms: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'http://localhost:3000/api/dashboard';

  constructor(private http: HttpClient) { }

  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}/stats`);
  }

  getRecentReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}/recent-reservations`);
  }

  // Método alternativo que obtiene las reservas y luego completa los datos relacionados
  getRecentReservationsWithDetails(): Observable<Reservation[]> {
    return this.getRecentReservations().pipe(
      switchMap(reservations => {
        // Si las reservas ya tienen los datos relacionados, las devolvemos tal como están
        if (reservations.length > 0 && reservations[0].customer && reservations[0].room && reservations[0].employee) {
          return [reservations];
        }
        
        // Si no tienen los datos relacionados, intentamos obtenerlos
        const reservationRequests = reservations.map(reservation => {
          const requests = [
            this.http.get<Customer>(`http://localhost:3000/api/customers/${reservation.customerId}`),
            this.http.get<Room>(`http://localhost:3000/api/rooms/${reservation.roomId}`),
            this.http.get<Employee>(`http://localhost:3000/api/employees/${reservation.employeeId}`)
          ];
          
          return forkJoin(requests).pipe(
            map(([customer, room, employee]) => ({
              ...reservation,
              customer: customer as Customer,
              room: room as Room,
              employee: employee as Employee
            }))
          );
        });
        
        return forkJoin(reservationRequests);
      })
    );
  }
}
