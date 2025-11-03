import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Room } from '../../../models/room.model';
import { RoomService } from '../../../services/room.service';
import { LoginComponent } from '../../login/login.component';

@Component({
  selector: 'app-available-rooms',
  standalone: true,
  imports: [FormsModule, CommonModule, LoginComponent],
  templateUrl: './available-rooms.component.html',
  styleUrl: './available-rooms.component.scss'
})
export class AvailableRoomsComponent implements OnInit, OnChanges {
  
  @Input() searchParams: any = {};
  
  searchForm = {
    startDate: '',
    endDate: ''
  };
  
  availableRooms: Room[] = [];
  loading = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private roomService: RoomService
  ) {}

  ngOnInit(): void {
    console.log('AvailableRooms - ngOnInit - searchParams recibidos:', this.searchParams);
    
    // Intentar obtener fechas de los parámetros de entrada
    if (this.searchParams && this.searchParams.startDate && this.searchParams.endDate) {
      console.log('AvailableRooms - Fechas encontradas en searchParams:', {
        startDate: this.searchParams.startDate,
        endDate: this.searchParams.endDate
      });
      this.searchForm.startDate = this.searchParams.startDate;
      this.searchForm.endDate = this.searchParams.endDate;
      this.searchAvailableRooms();
    } else {
      console.log('AvailableRooms - No se encontraron fechas en searchParams, intentando obtener de URL');
      // Como respaldo, intentar obtener las fechas directamente de la URL
      this.route.queryParams.subscribe(params => {
        console.log('AvailableRooms - Parámetros de URL como respaldo:', params);
        if (params['startDate'] && params['endDate']) {
          console.log('AvailableRooms - Fechas encontradas en URL:', {
            startDate: params['startDate'],
            endDate: params['endDate']
          });
          this.searchForm.startDate = params['startDate'];
          this.searchForm.endDate = params['endDate'];
          this.searchParams = params; // Actualizar searchParams
          this.searchAvailableRooms();
        } else {
          console.log('AvailableRooms - No se encontraron fechas en ningún lugar');
        }
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('AvailableRooms - ngOnChanges llamado con:', changes);
    // Reaccionar a cambios en los parámetros de búsqueda
    if (changes['searchParams'] && this.searchParams) {
      console.log('AvailableRooms - ngOnChanges - searchParams cambiados:', this.searchParams);
      if (this.searchParams.startDate && this.searchParams.endDate) {
        console.log('AvailableRooms - ngOnChanges - Fechas encontradas:', {
          startDate: this.searchParams.startDate,
          endDate: this.searchParams.endDate
        });
        this.searchForm.startDate = this.searchParams.startDate;
        this.searchForm.endDate = this.searchParams.endDate;
        this.searchAvailableRooms();
      } else {
        console.log('AvailableRooms - ngOnChanges - Fechas no encontradas en searchParams');
      }
    }
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
    // Navegar a la página de confirmación de reserva con los datos de la habitación seleccionada
    const navigationParams = {
      ...this.searchParams,
      roomId: room.id,
      roomType: room.type,
      roomPrice: room.price,
      // Asegurar que las fechas estén incluidas explícitamente
      startDate: this.searchForm.startDate || this.searchParams.startDate,
      endDate: this.searchForm.endDate || this.searchParams.endDate
    };
    
    console.log('AvailableRooms - Navegando a confirm-reservation con parámetros:', navigationParams);
    console.log('AvailableRooms - searchParams originales:', this.searchParams);
    console.log('AvailableRooms - searchForm fechas:', {
      startDate: this.searchForm.startDate,
      endDate: this.searchForm.endDate
    });
    console.log('AvailableRooms - Fechas en searchParams:', {
      startDate: this.searchParams.startDate,
      endDate: this.searchParams.endDate
    });
    console.log('AvailableRooms - Fechas finales enviadas:', {
      startDate: navigationParams.startDate,
      endDate: navigationParams.endDate
    });
    
    this.router.navigate(['/confirm-reservation'], {
      queryParams: navigationParams
    });
  }

  goToRooms(): void {
    this.router.navigate(['/rooms']);
  }

  goToLogin(room?: Room){
    // Si se pasa una habitación, guardar los parámetros de reserva para después del login
    const queryParams: any = {};
    
    if (room) {
      // Guardar todos los parámetros necesarios para la reserva
      queryParams.returnUrl = '/confirm-reservation';
      queryParams.roomId = room.id;
      queryParams.roomType = room.type;
      queryParams.roomPrice = room.price;
      queryParams.startDate = this.searchForm.startDate || this.searchParams.startDate;
      queryParams.endDate = this.searchForm.endDate || this.searchParams.endDate;
    } else {
      // Si no hay habitación seleccionada, guardar la URL actual para volver después del login
      queryParams.returnUrl = this.router.url;
    }
    
    this.router.navigate(['/login'], { queryParams });
  }

}
