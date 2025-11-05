import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reservation, ReservationCreateRequest, ReservationUpdateRequest } from '../models/reservation.model';
import { environment } from '../../environments/environment';

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
}
