import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Reservation, ReservationCreateRequest, ReservationStatus } from '../../models/reservation.model';
import { ReservationService } from '../../services/reservation.service';
import { Customer } from '../../models/customer.model';
import { Room } from '../../models/room.model';
import { CustomerService } from '../../services/customer.service';
import { RoomService } from '../../services/room.service';

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.scss']
})
export class ReservationsComponent implements OnInit {
  reservations: Reservation[] = [];
  customers: Customer[] = [];
  rooms: Room[] = [];
  showAddForm = false;
  editingReservation: Reservation | null = null;
  
  newReservation: ReservationCreateRequest = {
    customerId: 0,
    roomId: 0,
    checkIn: new Date(),
    checkOut: new Date(),
    totalPrice: 0,
    status: ReservationStatus.PENDING,
    notes: ''
  };

  reservationStatuses = Object.values(ReservationStatus);

  constructor(
    private reservationService: ReservationService,
    private customerService: CustomerService,
    private roomService: RoomService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadReservations();
    this.loadCustomers();
    this.loadRooms();
    
    // Check for query parameters from landing page or room selection
    this.route.queryParams.subscribe(params => {
      if (params['startDate'] || params['endDate'] || params['petType'] || params['roomId']) {
        this.showAddForm = true;
        if (params['startDate']) {
          this.newReservation.checkIn = new Date(params['startDate']);
        }
        if (params['endDate']) {
          this.newReservation.checkOut = new Date(params['endDate']);
        }
        if (params['roomId']) {
          this.newReservation.roomId = parseInt(params['roomId']);
        }
        if (params['roomPrice']) {
          // Calcular precio total basado en las noches
          const startDate = new Date(params['startDate']);
          const endDate = new Date(params['endDate']);
          const nights = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
          this.newReservation.totalPrice = nights * parseFloat(params['roomPrice']);
        }
        if (params['petType']) {
          this.newReservation.notes = `Tipo de mascota: ${params['petType']}`;
        }
      }
    });
  }

  loadReservations(): void {
    this.reservationService.getAllReservations().subscribe({
      next: (reservations) => this.reservations = reservations,
      error: (error) => console.error('Error loading reservations:', error)
    });
  }

  loadCustomers(): void {
    this.customerService.getAllCustomers().subscribe({
      next: (customers) => this.customers = customers,
      error: (error) => console.error('Error loading customers:', error)
    });
  }

  loadRooms(): void {
    this.roomService.getAllRooms().subscribe({
      next: (rooms) => this.rooms = rooms,
      error: (error) => console.error('Error loading rooms:', error)
    });
  }

  addReservation(): void {
    // Validaciones
    if (!this.newReservation.customerId || !this.newReservation.roomId) {
      alert('Por favor, selecciona un cliente y una habitación.');
      return;
    }

    if (this.newReservation.checkIn >= this.newReservation.checkOut) {
      alert('La fecha de check-in debe ser anterior a la fecha de check-out.');
      return;
    }

    if (this.newReservation.totalPrice <= 0) {
      alert('El precio total debe ser mayor a 0.');
      return;
    }

    this.reservationService.createReservation(this.newReservation).subscribe({
      next: () => {
        alert('Reserva creada exitosamente!');
        this.loadReservations();
        this.resetForm();
        this.showAddForm = false;
      },
      error: (error) => {
        console.error('Error creating reservation:', error);
        alert('Error al crear la reserva. Por favor, intenta de nuevo.');
      }
    });
  }

  editReservation(reservation: Reservation): void {
    this.editingReservation = { ...reservation };
    this.showAddForm = true;
  }

  updateReservation(): void {
    if (this.editingReservation) {
      this.reservationService.updateReservation(this.editingReservation.id!, this.editingReservation).subscribe({
        next: () => {
          this.loadReservations();
          this.resetForm();
          this.showAddForm = false;
        },
        error: (error) => console.error('Error updating reservation:', error)
      });
    }
  }

  deleteReservation(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta reserva?')) {
      this.reservationService.deleteReservation(id).subscribe({
        next: () => this.loadReservations(),
        error: (error) => console.error('Error deleting reservation:', error)
      });
    }
  }

  cancelEdit(): void {
    this.resetForm();
    this.showAddForm = false;
  }

  calculateTotalPrice(): void {
    if (this.newReservation.roomId && this.newReservation.checkIn && this.newReservation.checkOut) {
      const room = this.rooms.find(r => r.id === this.newReservation.roomId);
      if (room) {
        const startDate = new Date(this.newReservation.checkIn);
        const endDate = new Date(this.newReservation.checkOut);
        const nights = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        this.newReservation.totalPrice = nights * room.price;
      }
    }
  }

  onRoomChange(): void {
    this.calculateTotalPrice();
  }

  onDateChange(): void {
    this.calculateTotalPrice();
  }

  getSelectedRoom(): Room | undefined {
    return this.rooms.find(room => room.id === this.newReservation.roomId);
  }

  getNights(): number {
    if (this.newReservation.checkIn && this.newReservation.checkOut) {
      const startDate = new Date(this.newReservation.checkIn);
      const endDate = new Date(this.newReservation.checkOut);
      return Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    }
    return 0;
  }

  private resetForm(): void {
    this.newReservation = {
      customerId: 0,
      roomId: 0,
      checkIn: new Date(),
      checkOut: new Date(),
      totalPrice: 0,
      status: ReservationStatus.PENDING,
      notes: ''
    };
    this.editingReservation = null;
  }
}
