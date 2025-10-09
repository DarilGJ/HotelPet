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
    
    // Check for query parameters from landing page
    this.route.queryParams.subscribe(params => {
      if (params['startDate'] || params['endDate'] || params['petType']) {
        this.showAddForm = true;
        if (params['startDate']) {
          this.newReservation.checkIn = new Date(params['startDate']);
        }
        if (params['endDate']) {
          this.newReservation.checkOut = new Date(params['endDate']);
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
    this.reservationService.createReservation(this.newReservation).subscribe({
      next: () => {
        this.loadReservations();
        this.resetForm();
        this.showAddForm = false;
      },
      error: (error) => console.error('Error creating reservation:', error)
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
