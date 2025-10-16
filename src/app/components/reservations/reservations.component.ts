import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Reservation, ReservationCreateRequest, ReservationStatus } from '../../models/reservation.model';
import { ReservationService } from '../../services/reservation.service';
import { Customer } from '../../models/customer.model';
import { Room } from '../../models/room.model';
import { Employee } from '../../models/employee.model';
import { CustomerService } from '../../services/customer.service';
import { RoomService } from '../../services/room.service';
import { EmployeeService } from '../../services/employee.service';

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
  employees: Employee[] = [];
  showAddForm = false;
  editingReservation: Reservation | null = null;
  
  newReservation: ReservationCreateRequest = {
    startDate: new Date(),
    endDate: new Date(),
    checkInDate: undefined,
    checkOutDate: undefined,
    status: ReservationStatus.PENDING,
    observation: '',
    subTotal: 0,
    iva: 0,
    total: 0,
    customerId: 0,
    roomId: 0,
    employeeId: 0
  };

  reservationStatuses = Object.values(ReservationStatus);

  constructor(
    private reservationService: ReservationService,
    private customerService: CustomerService,
    private roomService: RoomService,
    private employeeService: EmployeeService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadReservations();
    this.loadCustomers();
    this.loadRooms();
    this.loadEmployees();
    
    // Check for query parameters from landing page or room selection
    this.route.queryParams.subscribe(params => {
      if (params['startDate'] || params['endDate'] || params['petType'] || params['roomId']) {
        this.showAddForm = true;
        if (params['startDate']) {
          this.newReservation.startDate = new Date(params['startDate']);
        }
        if (params['endDate']) {
          this.newReservation.endDate = new Date(params['endDate']);
        }
        if (params['roomId']) {
          this.newReservation.roomId = parseInt(params['roomId']);
        }
        if (params['roomPrice']) {
          // Calcular precio total basado en las noches
          const startDate = new Date(params['startDate']);
          const endDate = new Date(params['endDate']);
          const nights = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
          this.newReservation.subTotal = nights * parseFloat(params['roomPrice']);
          // Calcular IVA automáticamente (12%)
          this.newReservation.iva = this.newReservation.subTotal * 0.12;
          // Calcular total (subtotal + IVA)
          this.newReservation.total = this.newReservation.subTotal + this.newReservation.iva;
        }
        if (params['petType']) {
          this.newReservation.observation = `Tipo de mascota: ${params['petType']}`;
        }
      }
    });
  }

  loadReservations(): void {
    // Intentar primero con el método que incluye relaciones
    this.reservationService.getReservationsWithRelations().subscribe({
      next: (reservations) => {
        console.log('Reservas cargadas con relaciones:', reservations);
        this.reservations = reservations;
        // Asegurar que los datos relacionados estén cargados
        this.loadRelatedDataForReservations();
      },
      error: (error) => {
        console.warn('Error cargando reservas con relaciones, intentando método alternativo:', error);
        // Fallback al método original si el nuevo no funciona
        this.reservationService.getAllReservations().subscribe({
          next: (reservations) => {
            console.log('Reservas cargadas (método alternativo):', reservations);
            this.reservations = reservations;
            // Cargar datos relacionados manualmente
            this.loadRelatedDataForReservations();
          },
          error: (fallbackError) => console.error('Error loading reservations:', fallbackError)
        });
      }
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

  loadEmployees(): void {
    this.employeeService.getAllEmployees().subscribe({
      next: (employees) => this.employees = employees,
      error: (error) => console.error('Error loading employees:', error)
    });
  }

  addReservation(): void {
    // Validaciones
    if (!this.newReservation.customerId || !this.newReservation.roomId || !this.newReservation.employeeId) {
      alert('Por favor, selecciona un cliente, una habitación y un empleado.');
      return;
    }

    if (this.newReservation.startDate >= this.newReservation.endDate) {
      alert('La fecha de inicio debe ser anterior a la fecha de fin.');
      return;
    }

    if (this.newReservation.total <= 0) {
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
    if (this.newReservation.roomId && this.newReservation.startDate && this.newReservation.endDate) {
      const room = this.rooms.find(r => r.id === this.newReservation.roomId);
      if (room) {
        const startDate = new Date(this.newReservation.startDate);
        const endDate = new Date(this.newReservation.endDate);
        const nights = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        
        // Calcular subtotal (noches * precio por noche)
        this.newReservation.subTotal = nights * room.price;
        
        // Calcular IVA automáticamente (12%)
        this.newReservation.iva = this.newReservation.subTotal * 0.12;
        
        // Calcular total (subtotal + IVA)
        this.newReservation.total = this.newReservation.subTotal + this.newReservation.iva;
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
    if (this.newReservation.startDate && this.newReservation.endDate) {
      const startDate = new Date(this.newReservation.startDate);
      const endDate = new Date(this.newReservation.endDate);
      return Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    }
    return 0;
  }

  private resetForm(): void {
    this.newReservation = {
      startDate: new Date(),
      endDate: new Date(),
      checkInDate: undefined,
      checkOutDate: undefined,
      status: ReservationStatus.PENDING,
      observation: '',
      subTotal: 0,
      iva: 0,
      total: 0,
      customerId: 0,
      roomId: 0,
      employeeId: 0
    };
    this.editingReservation = null;
  }

  // Método auxiliar para cargar datos relacionados si no están disponibles
  private loadRelatedDataForReservations(): void {
    this.reservations.forEach(reservation => {
      // Cargar datos del cliente si no están disponibles
      if (!reservation.customer && reservation.customerId) {
        const customer = this.customers.find(c => c.id === reservation.customerId);
        if (customer) {
          reservation.customer = customer;
        }
      }
      
      // Cargar datos de la habitación si no están disponibles
      if (!reservation.room && reservation.roomId) {
        const room = this.rooms.find(r => r.id === reservation.roomId);
        if (room) {
          reservation.room = room;
        }
      }
      
      // Cargar datos del empleado si no están disponibles
      if (!reservation.employee && reservation.employeeId) {
        const employee = this.employees.find(e => e.id === reservation.employeeId);
        if (employee) {
          reservation.employee = employee;
        }
      }
    });
  }
}
