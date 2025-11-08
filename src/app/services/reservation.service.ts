import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Reservation, ReservationCreateRequest, ReservationUpdateRequest, ReservationReportsResponse, ReservationStatus } from '../models/reservation.model';
import { environment } from '../../environments/environment';

// Interfaz temporal para la respuesta cruda del backend
interface ReservationRaw {
  id?: number;
  startDate: string | Date;
  endDate: string | Date;
  checkInDate?: string | Date;
  checkOutDate?: string | Date;
  status: string;
  observation?: string;
  subTotal: number | string;
  iva: number | string;
  total: number | string;
  customerId: number;
  roomId: number;
  employeeId: number;
  customer?: any;
  room?: any;
  employee?: any;
}

interface ReservationReportsResponseRaw {
  reservations: ReservationRaw[];
  statistics: {
    totalReservations: number;
    totalRevenue: number;
    averageReservationValue: number;
    reservationsByStatus: {
      PENDING?: number;
      CONFIRMED?: number;
      IN_PROGRESS?: number;
      COMPLETED?: number;
      CANCELED?: number;
    };
    reservationsByMonth: { [key: string]: number };
    revenueByMonth: { [key: string]: number };
  };
  filterOptions: {
    roomTypes: string[];
  };
}

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private apiUrl = `${environment.apiUrl}/reserves`;

  constructor(private http: HttpClient) { }

  getAllReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}?include=customer,room,employee`);
  }

  getReservationById(id: number): Observable<Reservation> {
    return this.http.get<Reservation>(`${this.apiUrl}/${id}?include=customer,room,employee`);
  }

  createReservation(reservation: ReservationCreateRequest): Observable<Reservation> {
    return this.http.post<Reservation>(this.apiUrl, reservation);
  }

  updateReservation(id: number, reservation: ReservationUpdateRequest): Observable<Reservation> {
    return this.http.put<Reservation>(`${this.apiUrl}/${id}`, reservation);
  }

  deleteReservation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getReservationsByCustomer(customerId: number): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}/customer/${customerId}`);
  }

  getReservationsByRoom(roomId: number): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}/room/${roomId}`);
  }

  getActiveReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}/active?include=customer,room,employee`);
  }

  getReservationsWithRelations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}/with-relations`);
  }

  getReservationReports(filters?: {
    status?: string;
    startDate?: string;
    endDate?: string;
    customerName?: string;
    roomType?: string;
  }): Observable<ReservationReportsResponse> {
    let params = new HttpParams();
    
    if (filters?.status && filters.status !== 'all') {
      params = params.set('status', filters.status);
    } else {
      params = params.set('status', 'all');
    }
    
    if (filters?.startDate) {
      params = params.set('startDate', filters.startDate);
    }
    
    if (filters?.endDate) {
      params = params.set('endDate', filters.endDate);
    }
    
    if (filters?.customerName) {
      params = params.set('customerName', filters.customerName);
    }
    
    if (filters?.roomType && filters.roomType !== 'all') {
      params = params.set('roomType', filters.roomType);
    } else {
      params = params.set('roomType', 'all');
    }

    return this.http.get<ReservationReportsResponseRaw>(`${this.apiUrl}/reports`, { params }).pipe(
      map(response => {
        // Convertir las reservaciones: mapear status de mayúsculas a minúsculas y convertir fechas
        const reservations: Reservation[] = response.reservations.map(res => ({
          ...res,
          status: this.mapStatusFromBackend(res.status as string),
          startDate: new Date(res.startDate),
          endDate: new Date(res.endDate),
          checkInDate: res.checkInDate ? new Date(res.checkInDate) : undefined,
          checkOutDate: res.checkOutDate ? new Date(res.checkOutDate) : undefined,
          subTotal: typeof res.subTotal === 'string' ? parseFloat(res.subTotal) : (res.subTotal || 0),
          iva: typeof res.iva === 'string' ? parseFloat(res.iva) : (res.iva || 0),
          total: typeof res.total === 'string' ? parseFloat(res.total) : (res.total || 0)
        }));

        return {
          reservations,
          statistics: response.statistics,
          filterOptions: response.filterOptions
        } as ReservationReportsResponse;
      })
    );
  }

  private mapStatusFromBackend(status: string): ReservationStatus {
    const statusMap: { [key: string]: ReservationStatus } = {
      'PENDING': ReservationStatus.PENDING,
      'CONFIRMED': ReservationStatus.CONFIRMED,
      'IN_PROGRESS': ReservationStatus.IN_PROGRESS,
      'COMPLETED': ReservationStatus.COMPLETED,
      'CANCELED': ReservationStatus.CANCELED
    };
    return statusMap[status] || status as ReservationStatus;
  }
}
