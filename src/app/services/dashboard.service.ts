import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map, switchMap, of } from 'rxjs';
import { Reservation } from '../models/reservation.model';
import { Customer } from '../models/customer.model';
import { Room } from '../models/room.model';
import { Employee } from '../models/employee.model';
import { environment } from '../../environments/environment';

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
  private apiUrl = `${environment.apiUrl}/dashboard`;

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
        // Si no hay reservas, devolver un array vacío
        if (!reservations || reservations.length === 0) {
          console.log('No hay reservas recientes');
          return of([]);
        }
        
        console.log('Reservas obtenidas del endpoint:', reservations.length);
        console.log('Primera reserva:', reservations[0]);
        console.log('Tiene customer?:', !!reservations[0].customer);
        console.log('Tiene room?:', !!reservations[0].room);
        console.log('Tiene employee?:', !!reservations[0].employee);
        
        // Si las reservas ya tienen los datos relacionados, las devolvemos tal como están
        if (reservations[0].customer && reservations[0].room && reservations[0].employee) {
          console.log('Las reservas ya tienen todos los datos relacionados');
          return of(reservations);
        }
        
        console.log('Las reservas no tienen todos los datos relacionados, cargándolos...');
        // Si no tienen los datos relacionados, intentamos obtenerlos
        const reservationRequests = reservations.map(reservation => {
          console.log(`Cargando datos para reserva ${reservation.id}: customerId=${reservation.customerId}, roomId=${reservation.roomId}, employeeId=${reservation.employeeId}`);
          
          const customerRequest = this.http.get<Customer>(`${environment.apiUrl}/customers/${reservation.customerId}`);
          const roomRequest = this.http.get<Room>(`${environment.apiUrl}/rooms/${reservation.roomId}`);
          const employeeRequest = this.http.get<Employee>(`${environment.apiUrl}/employees/${reservation.employeeId}`);
          
          return forkJoin({
            customer: customerRequest,
            room: roomRequest,
            employee: employeeRequest
          }).pipe(
            map(({ customer, room, employee }) => {
              console.log(`Datos cargados para reserva ${reservation.id}:`, {
                customer: customer?.name,
                room: room?.number,
                roomType: room?.type,
                employee: employee?.name
              });
              return {
                ...reservation,
                customer: customer as Customer,
                room: room as Room,
                employee: employee as Employee
              };
            })
          );
        });
        
        // Si no hay requests, devolver array vacío
        if (reservationRequests.length === 0) {
          return of([]);
        }
        
        return forkJoin(reservationRequests);
      })
    );
  }
}
