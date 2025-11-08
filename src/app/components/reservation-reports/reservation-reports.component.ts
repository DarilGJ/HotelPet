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
    this.reservationService.getAllReservations().subscribe({
      next: (reservations) => {
        this.reservations = reservations.map(res => ({
          ...res,
          startDate: new Date(res.startDate),
          endDate: new Date(res.endDate),
          checkInDate: res.checkInDate ? new Date(res.checkInDate) : undefined,
          checkOutDate: res.checkOutDate ? new Date(res.checkOutDate) : undefined
        }));
        this.filteredReservations = [...this.reservations];
        this.calculateStatistics();
        this.extractRoomTypes();
      },
      error: (error) => {
        console.error('Error loading reservations:', error);
      }
    });
  }

  extractRoomTypes(): void {
    const types = new Set<string>();
    this.reservations.forEach(res => {
      if (res.room?.type) {
        types.add(res.room.type);
      }
    });
    this.roomTypes = Array.from(types);
  }

  applyFilters(): void {
    this.filteredReservations = this.reservations.filter(reservation => {
      // Filtro por estado
      if (this.filterStatus !== 'all' && reservation.status !== this.filterStatus) {
        return false;
      }

      // Filtro por fecha de inicio
      if (this.filterStartDate) {
        const startDate = new Date(this.filterStartDate);
        if (new Date(reservation.startDate) < startDate) {
          return false;
        }
      }

      // Filtro por fecha de fin
      if (this.filterEndDate) {
        const endDate = new Date(this.filterEndDate);
        endDate.setHours(23, 59, 59, 999);
        if (new Date(reservation.endDate) > endDate) {
          return false;
        }
      }

      // Filtro por nombre de cliente
      if (this.filterCustomerName) {
        const customerName = reservation.customer?.name?.toLowerCase() || '';
        const customerLastName = reservation.customer?.lastName?.toLowerCase() || '';
        const searchTerm = this.filterCustomerName.toLowerCase();
        if (!customerName.includes(searchTerm) && !customerLastName.includes(searchTerm)) {
          return false;
        }
      }

      // Filtro por tipo de habitación
      if (this.filterRoomType !== 'all' && reservation.room?.type !== this.filterRoomType) {
        return false;
      }

      return true;
    });
    
    this.calculateStatistics();
  }

  resetFilters(): void {
    this.filterStatus = 'all';
    this.filterStartDate = '';
    this.filterEndDate = '';
    this.filterCustomerName = '';
    this.filterRoomType = 'all';
    this.filteredReservations = [...this.reservations];
    this.calculateStatistics();
  }

  calculateStatistics(): void {
    const filtered = this.filteredReservations;
    
    // Total de reservaciones
    this.totalReservations = filtered.length;
    
    // Ingresos totales
    this.totalRevenue = filtered.reduce((sum, res) => sum + (res.total || 0), 0);
    
    // Valor promedio
    this.averageReservationValue = this.totalReservations > 0 
      ? this.totalRevenue / this.totalReservations 
      : 0;
    
    // Reservaciones por estado
    this.reservationsByStatus.clear();
    filtered.forEach(res => {
      const count = this.reservationsByStatus.get(res.status) || 0;
      this.reservationsByStatus.set(res.status, count + 1);
    });
    
    // Reservaciones e ingresos por mes
    this.reservationsByMonth.clear();
    this.revenueByMonth.clear();
    filtered.forEach(res => {
      const monthKey = this.getMonthKey(res.startDate);
      const resCount = this.reservationsByMonth.get(monthKey) || 0;
      this.reservationsByMonth.set(monthKey, resCount + 1);
      
      const revAmount = this.revenueByMonth.get(monthKey) || 0;
      this.revenueByMonth.set(monthKey, revAmount + (res.total || 0));
    });
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

