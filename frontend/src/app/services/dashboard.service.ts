import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DashboardStats {
  totalCustomers: number;
  totalEmployees: number;
  totalRooms: number;
  totalReservations: number;
  activeReservations: number;
  availableRooms: number;
}

export interface RecentReservation {
  id: number;
  customerName: string;
  roomNumber: string;
  checkIn: Date;
  checkOut: Date;
  status: string;
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

  getRecentReservations(): Observable<RecentReservation[]> {
    return this.http.get<RecentReservation[]>(`${this.apiUrl}/recent-reservations`);
  }
}
