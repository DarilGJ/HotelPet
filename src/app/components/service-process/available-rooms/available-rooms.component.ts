import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Room } from '../../../models/room.model';
import { RoomService } from '../../../services/room.service';

@Component({
  selector: 'app-available-rooms',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './available-rooms.component.html',
  styleUrl: './available-rooms.component.scss'
})
export class AvailableRoomsComponent implements OnInit {
  
  searchForm = {
    startDate: '',
    endDate: ''
  };
  
  availableRooms: Room[] = [];
  loading = false;
  searchParams: any = {};

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private roomService: RoomService
  ) {}

  ngOnInit(): void {
    // Obtener parámetros de la URL
    this.route.queryParams.subscribe(params => {
      if (params['startDate'] && params['endDate']) {
        this.searchForm.startDate = params['startDate'];
        this.searchForm.endDate = params['endDate'];
        this.searchParams = params;
        this.searchAvailableRooms();
      }
    });
  }

  searchAvailableRooms(): void {
    if (!this.searchForm.startDate || !this.searchForm.endDate) {
      alert('Por favor, selecciona las fechas de entrada y salida.');
      return;
    }

    this.loading = true;
    
    // Por ahora, cargar todas las habitaciones
    // En una implementación real, esto sería un endpoint específico para habitaciones disponibles
    this.roomService.getAllRooms().subscribe({
      next: (rooms) => {
        this.availableRooms = rooms;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading rooms:', error);
        this.loading = false;
      }
    });
  }

  selectRoom(room: Room): void {
    // Navegar a la página de reservas con los datos de la habitación seleccionada
    this.router.navigate(['/reservations'], {
      queryParams: {
        ...this.searchParams,
        roomId: room.id,
        roomType: room.type,
        roomPrice: room.price
      }
    });
  }

  goToRooms(): void {
    this.router.navigate(['/rooms']);
  }

}
