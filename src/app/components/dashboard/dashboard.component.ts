import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

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

  recentReservations: any[] = [];

  constructor() { }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    // TODO: Implementar carga de datos del dashboard
    // Aquí se cargarán las estadísticas y reservas recientes
  }
}
