import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Room, RoomCreateRequest, RoomType, RoomAvailability } from '../../models/room.model';
import { RoomService } from '../../services/room.service';
import { ReservationService } from '../../services/reservation.service';
import { Reservation, ReservationStatus } from '../../models/reservation.model';

@Component({
  selector: 'app-rooms',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss']
})
export class RoomsComponent implements OnInit {
  rooms: Room[] = [];
  reservations: Reservation[] = [];
  showAddForm = false;
  editingRoom: Room | null = null;
  // Guardar el estado original de las habitaciones del backend
  private originalRoomStates: Map<number, RoomAvailability> = new Map();
  
  // Opciones para los selects
  roomTypes = Object.values(RoomType);
  availabilityOptions = Object.values(RoomAvailability);
  
  newRoom: RoomCreateRequest = {
    number: '',
    type: RoomType.SINGLE,
    capacity: 1,
    price: 0,
    availability: RoomAvailability.AVAILABLE,
    description: ''
  };

  constructor(
    private roomService: RoomService,
    private reservationService: ReservationService
  ) {}

  ngOnInit(): void {
    this.loadRooms();
    this.loadReservations();
  }

  loadRooms(): void {
    this.roomService.getAllRooms().subscribe({
      next: (rooms) => {
        // Guardar el estado original de cada habitación del backend
        rooms.forEach(room => {
          if (room.id !== undefined) {
            this.originalRoomStates.set(room.id, room.availability);
          }
        });
        this.rooms = rooms;
        // NO actualizar automáticamente - respetar el estado del backend
        // Solo calcular para mostrar sugerencia (opcional)
      },
      error: (error) => console.error('Error loading rooms:', error)
    });
  }

  loadReservations(): void {
    this.reservationService.getAllReservations().subscribe({
      next: (reservations) => {
        this.reservations = reservations;
        // Las reservas se usan solo para mostrar sugerencias, no para sobrescribir el estado
      },
      error: (error) => console.error('Error loading reservations:', error)
    });
  }

  // Calcula dinámicamente la disponibilidad sugerida basándose en las reservas activas
  // PERO NO sobrescribe el estado guardado en el backend
  getCalculatedAvailability(room: Room): RoomAvailability {
    if (!this.reservations.length || !room.id) {
      return room.availability; // Retornar el estado del backend
    }

    const now = new Date();
    now.setHours(0, 0, 0, 0); // Normalizar a inicio del día

    // Buscar reservas activas para esta habitación
    const activeReservations = this.reservations.filter(reservation => {
      // Verificar que la reserva sea para esta habitación
      if (reservation.roomId !== room.id) {
        return false;
      }

      // Verificar que el estado de la reserva sea activo (no cancelada ni completada)
      const activeStatuses = [
        ReservationStatus.PENDING,
        ReservationStatus.CONFIRMED,
        ReservationStatus.IN_PROGRESS
      ];
      if (!activeStatuses.includes(reservation.status)) {
        return false;
      }

      // Verificar si la reserva está en curso
      const startDate = new Date(reservation.startDate);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(reservation.endDate);
      endDate.setHours(23, 59, 59, 999);

      // La habitación está ocupada si:
      // 1. La reserva tiene checkInDate pero no checkOutDate (ocupada actualmente)
      // 2. La fecha actual está dentro del rango de la reserva
      const hasCheckIn = reservation.checkInDate != null;
      const hasCheckOut = reservation.checkOutDate != null;
      const isInDateRange = now >= startDate && now <= endDate;

      return (hasCheckIn && !hasCheckOut) || isInDateRange;
    });

    // Si hay reservas activas, la habitación debería estar ocupada
    return activeReservations.length === 0 ? RoomAvailability.AVAILABLE : RoomAvailability.OCCUPIED;
  }

  // Método para obtener el estado de disponibilidad (del backend, respetando cambios manuales)
  getRoomAvailability(room: Room): RoomAvailability {
    // Retornar el estado guardado en el backend (puede ser modificado manualmente)
    return room.availability;
  }

  // Verificar si hay discrepancia entre el estado manual y el calculado
  hasAvailabilityMismatch(room: Room): boolean {
    if (!room.id) return false;
    const calculated = this.getCalculatedAvailability(room);
    const manual = this.getRoomAvailability(room);
    // Solo mostrar advertencia si el estado manual es 'available' pero debería estar 'occupied'
    return calculated === RoomAvailability.OCCUPIED && manual === RoomAvailability.AVAILABLE;
  }

  // Método helper para obtener el texto del estado
  getAvailabilityText(availability: RoomAvailability): string {
    switch (availability) {
      case RoomAvailability.AVAILABLE:
        return 'Disponible';
      case RoomAvailability.OCCUPIED:
        return 'Ocupada';
      case RoomAvailability.MAINTENANCE:
        return 'Mantenimiento';
      default:
        return 'Desconocido';
    }
  }

  // Método helper para obtener la clase CSS del estado
  getAvailabilityClass(availability: RoomAvailability): string {
    switch (availability) {
      case RoomAvailability.AVAILABLE:
        return 'available';
      case RoomAvailability.OCCUPIED:
        return 'occupied';
      case RoomAvailability.MAINTENANCE:
        return 'maintenance';
      default:
        return '';
    }
  }

  addRoom(): void {
    this.roomService.createRoom(this.newRoom).subscribe({
      next: () => {
        this.loadRooms();
        this.loadReservations(); // Recargar reservas para actualizar disponibilidad
        this.resetForm();
        this.showAddForm = false;
      },
      error: (error) => console.error('Error creating room:', error)
    });
  }

  editRoom(room: Room): void {
    // Crear una copia profunda para editar, respetando el estado actual
    this.editingRoom = { 
      ...room,
      availability: room.availability // Mantener el estado actual del backend
    };
    this.showAddForm = true;
  }

  updateRoom(): void {
    if (this.editingRoom) {
      // Preparar el objeto de actualización con el estado availability que el usuario estableció
      const updateData = {
        number: this.editingRoom.number,
        type: this.editingRoom.type,
        capacity: this.editingRoom.capacity,
        price: this.editingRoom.price,
        availability: this.editingRoom.availability, // Guardar el estado que el usuario estableció
        description: this.editingRoom.description,
        imageUrl: this.editingRoom.imageUrl
      };

      this.roomService.updateRoom(this.editingRoom.id!, updateData).subscribe({
        next: () => {
          // Actualizar el estado original guardado
          if (this.editingRoom?.id) {
            this.originalRoomStates.set(this.editingRoom.id, this.editingRoom.availability);
          }
          this.loadRooms(); // Recargar para ver los cambios
          this.resetForm();
          this.showAddForm = false;
        },
        error: (error) => {
          console.error('Error updating room:', error);
          alert('Error al actualizar la habitación. Por favor, intenta de nuevo.');
        }
      });
    }
  }

  deleteRoom(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta habitación?')) {
      this.roomService.deleteRoom(id).subscribe({
        next: () => {
          this.loadRooms();
          this.loadReservations(); // Recargar reservas para actualizar disponibilidad
        },
        error: (error) => console.error('Error deleting room:', error)
      });
    }
  }

  cancelEdit(): void {
    this.resetForm();
    this.showAddForm = false;
  }

  private resetForm(): void {
    this.newRoom = {
      number: '',
      type: RoomType.SINGLE,
      capacity: 1,
      price: 0,
      availability: RoomAvailability.AVAILABLE,
      description: ''
    };
    this.editingRoom = null;
  }
}
