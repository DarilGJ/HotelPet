import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardService } from 'src/app/services/dashboard.service';
import { Reservation } from 'src/app/models/reservation.model';

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

  constructor(
    private dashboardService: DashboardService
  ) { }

  ngOnInit(): void {
    this.loadDashboardData();
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
    
    // Cargar reservas recientes
    this.dashboardService.getRecentReservations().subscribe({
      next: (reservations) => {
        console.log('Reservas recientes cargadas', reservations);
        this.recentReservations = reservations;
      },
      error: (error) => {
        console.error('Error cargando reservas recientes:', error);
      }
    });
  }
}
