import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Reservation, ReservationStatus } from '../../models/reservation.model';
import { ReservationService } from '../../services/reservation.service';
import { Customer } from '../../models/customer.model';
import { Room } from '../../models/room.model';
import { Employee } from '../../models/employee.model';

@Component({
  selector: 'app-reservation-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reservation-reports.component.html',
  styleUrls: ['./reservation-reports.component.scss']
})
export class ReservationReportsComponent implements OnInit {
  reservations: Reservation[] = [];
  filteredReservations: Reservation[] = [];
  
  // Filtros
  filterStatus: ReservationStatus | 'all' = 'all';
  filterStartDate: string = '';
  filterEndDate: string = '';
  filterCustomerName: string = '';
  filterRoomType: string = 'all';
  
  // Estadísticas
  totalReservations: number = 0;
  totalRevenue: number = 0;
  averageReservationValue: number = 0;
  reservationsByStatus: Map<ReservationStatus, number> = new Map();
  reservationsByMonth: Map<string, number> = new Map();
  revenueByMonth: Map<string, number> = new Map();
  
  // Opciones de filtro
  reservationStatuses = Object.values(ReservationStatus);
  roomTypes: string[] = [];
  
  constructor(
    private reservationService: ReservationService
  ) {}

  ngOnInit(): void {
    this.loadReservations();
  }

  loadReservations(): void {
    // Convertir el status del enum a mayúsculas para el backend
    const statusMap: { [key: string]: string } = {
      [ReservationStatus.PENDING]: 'PENDING',
      [ReservationStatus.CONFIRMED]: 'CONFIRMED',
      [ReservationStatus.IN_PROGRESS]: 'IN_PROGRESS',
      [ReservationStatus.COMPLETED]: 'COMPLETED',
      [ReservationStatus.CANCELED]: 'CANCELED'
    };

    const filters = {
      status: this.filterStatus !== 'all' ? statusMap[this.filterStatus] || this.filterStatus : undefined,
      startDate: this.filterStartDate || undefined,
      endDate: this.filterEndDate || undefined,
      customerName: this.filterCustomerName || undefined,
      roomType: this.filterRoomType !== 'all' ? this.filterRoomType : undefined
    };

    this.reservationService.getReservationReports(filters).subscribe({
      next: (response) => {
        // Las reservaciones ya están procesadas por el servicio
        this.reservations = response.reservations;
        this.filteredReservations = [...this.reservations];
        
        // Usar las estadísticas del backend
        this.updateStatisticsFromBackend(response.statistics);
        
        // Usar los tipos de habitación del backend
        this.roomTypes = response.filterOptions.roomTypes;
      },
      error: (error) => {
        console.error('Error loading reservations:', error);
      }
    });
  }

  updateStatisticsFromBackend(statistics: any): void {
    // Actualizar estadísticas generales
    this.totalReservations = Number(statistics.totalReservations) || 0;
    this.totalRevenue = Number(statistics.totalRevenue) || 0;
    this.averageReservationValue = Number(statistics.averageReservationValue) || 0;
    
    // Actualizar reservaciones por estado
    this.reservationsByStatus.clear();
    if (statistics.reservationsByStatus) {
      // El backend devuelve status en mayúsculas, pero necesitamos mapearlos al enum
      const statusMap: { [key: string]: ReservationStatus } = {
        'PENDING': ReservationStatus.PENDING,
        'CONFIRMED': ReservationStatus.CONFIRMED,
        'IN_PROGRESS': ReservationStatus.IN_PROGRESS,
        'COMPLETED': ReservationStatus.COMPLETED,
        'CANCELED': ReservationStatus.CANCELED
      };
      
      Object.keys(statistics.reservationsByStatus).forEach(key => {
        const status = statusMap[key];
        if (status) {
          this.reservationsByStatus.set(status, Number(statistics.reservationsByStatus[key]) || 0);
        }
      });
    }
    
    // Actualizar reservaciones e ingresos por mes
    this.reservationsByMonth.clear();
    this.revenueByMonth.clear();
    
    if (statistics.reservationsByMonth) {
      Object.keys(statistics.reservationsByMonth).forEach(monthKey => {
        this.reservationsByMonth.set(monthKey, Number(statistics.reservationsByMonth[monthKey]) || 0);
      });
    }
    
    if (statistics.revenueByMonth) {
      Object.keys(statistics.revenueByMonth).forEach(monthKey => {
        this.revenueByMonth.set(monthKey, Number(statistics.revenueByMonth[monthKey]) || 0);
      });
    }
  }

  applyFilters(): void {
    // Recargar las reservaciones con los nuevos filtros desde el backend
    this.loadReservations();
  }

  resetFilters(): void {
    this.filterStatus = 'all';
    this.filterStartDate = '';
    this.filterEndDate = '';
    this.filterCustomerName = '';
    this.filterRoomType = 'all';
    // Recargar sin filtros
    this.loadReservations();
  }


  getMonthKey(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${year}-${month}`;
  }

  formatMonthKey(key: string): string {
    const [year, month] = key.split('-');
    const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  }

  getStatusLabel(status: ReservationStatus): string {
    const labels: Record<ReservationStatus, string> = {
      [ReservationStatus.PENDING]: 'Pendiente',
      [ReservationStatus.CONFIRMED]: 'Confirmada',
      [ReservationStatus.IN_PROGRESS]: 'En Progreso',
      [ReservationStatus.COMPLETED]: 'Completada',
      [ReservationStatus.CANCELED]: 'Cancelada'
    };
    return labels[status] || status;
  }

  exportToCSV(): void {
    const headers = ['ID', 'Cliente', 'Habitación', 'Fecha Inicio', 'Fecha Fin', 'Check-in', 'Check-out', 'Estado', 'Subtotal', 'IVA', 'Total'];
    const rows = this.filteredReservations.map(res => [
      res.id || '',
      `${res.customer?.name || ''} ${res.customer?.lastName || ''}`.trim(),
      `${res.room?.number || ''} - ${res.room?.type || ''}`,
      this.formatDate(res.startDate),
      this.formatDate(res.endDate),
      res.checkInDate ? this.formatDate(res.checkInDate) : 'N/A',
      res.checkOutDate ? this.formatDate(res.checkOutDate) : 'N/A',
      this.getStatusLabel(res.status),
      res.subTotal.toFixed(2),
      res.iva.toFixed(2),
      res.total.toFixed(2)
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `reporte_reservas_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('es-GT');
  }
}

