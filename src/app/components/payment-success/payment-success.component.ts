import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NavbarComponent } from '../landing/navbar/navbar.component';
import { FooterComponent } from '../landing/footer/footer.component';
import { ReservationService } from '../../services/reservation.service';
import { RoomService } from '../../services/room.service';
import { Reservation } from '../../models/reservation.model';
import { Room, RoomType } from '../../models/room.model';

@Component({
  selector: 'app-payment-success',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent],
  templateUrl: './payment-success.component.html',
  styleUrl: './payment-success.component.scss'
})
export class PaymentSuccessComponent implements OnInit {
  reservation: Reservation | null = null;
  room: Room | null = null;
  reservationId: number | null = null;
  petName: string = '';
  petBreed: string = '';
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reservationService: ReservationService,
    private roomService: RoomService
  ) {}

  ngOnInit(): void {
    // Obtener datos de los queryParams
    this.route.queryParams.subscribe(params => {
      this.reservationId = params['reservationId'] ? +params['reservationId'] : null;
      this.petName = params['petName'] || '';
      this.petBreed = params['petBreed'] || '';

      if (this.reservationId) {
        this.loadReservation();
      } else {
        // Si no hay reservationId, intentar obtener datos básicos de los params
        this.loading = false;
      }
    });
  }

  loadReservation(): void {
    if (!this.reservationId) {
      this.loading = false;
      return;
    }

    this.reservationService.getReservationById(this.reservationId).subscribe({
      next: (reservation) => {
        this.reservation = reservation;
        
        // Si la reserva ya tiene la información de la habitación, usarla
        if (reservation.room) {
          this.room = reservation.room;
          this.loading = false;
        } 
        // Si no, cargar la habitación por separado
        else if (reservation.roomId) {
          this.loadRoom(reservation.roomId);
        } else {
          this.loading = false;
        }
      },
      error: (error) => {
        console.error('Error loading reservation:', error);
        this.loading = false;
      }
    });
  }

  loadRoom(roomId: number): void {
    this.roomService.getRoomById(roomId).subscribe({
      next: (room) => {
        this.room = room;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading room:', error);
        this.loading = false;
      }
    });
  }

  getConfirmationNumber(): string {
    if (this.reservation?.id) {
      return `Booking #${this.reservation.id.toString().padStart(10, '0')}`;
    }
    return 'Booking #N/A';
  }

  getRoomTypeText(): string {
    if (!this.room) return 'N/A';
    
    switch (this.room.type) {
      case RoomType.SINGLE:
        return 'Habitación Individual';
      case RoomType.DOUBLE:
        return 'Habitación Doble';
      case RoomType.SUITE:
        return 'Suite';
      default:
        return this.room.type;
    }
  }

  getPetTypeText(): string {
    return this.petBreed || 'No especificado';
  }

  getCheckInOutDates(): string {
    if (!this.reservation) return 'N/A';
    
    try {
      const startDate = new Date(this.reservation.startDate);
      const endDate = new Date(this.reservation.endDate);
      
      // Validar que las fechas sean válidas
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return 'Fechas no disponibles';
      }
      
      const formatDate = (date: Date): string => {
        return date.toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      };

      return `${formatDate(startDate)} - ${formatDate(endDate)}`;
    } catch (error) {
      console.error('Error formateando fechas:', error);
      return 'Fechas no disponibles';
    }
  }

  viewBookingDetails(): void {
    if (this.reservationId) {
      this.router.navigate(['/reservations'], { queryParams: { id: this.reservationId } });
    } else {
      this.router.navigate(['/reservations']);
    }
  }

  returnToHome(): void {
    this.router.navigate(['/']);
  }
}
