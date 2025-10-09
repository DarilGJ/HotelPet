import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardService } from 'src/app/services/dashboard.service';

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

  recentReservations: any[] = [{
    customer: {
      name: 'Juan Perez'
    },
    room: {
      number: '101'
    },
    checkIn: new Date(),
    checkOut: new Date(),
    status: 'confirmed'
  }];

  constructor(
    private dashboardService: DashboardService
  ) { }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    // TODO: Implementar carga de datos del dashboard
    // Aquí se cargarán las estadísticas y reservas recientes
    console.log('Cargando datos del dashboard');
    this.dashboardService.getDashboardStats().subscribe((stats) => {
      console.log('Estadísticas del dashboard cargadas', stats);
      this.stats = stats;
    });
    this.dashboardService.getRecentReservations().subscribe((reservations) => {
      this.recentReservations = reservations;
    });
  }
}
