import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-room',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './search-room.component.html',
  styleUrl: './search-room.component.scss'
})
export class SearchRoomComponent {

  bookingForm = {
    startDate: '',
    endDate: '',
  };

  constructor(private router: Router) {}

  goToSearchRoom() {
    if (this.bookingForm.startDate && this.bookingForm.endDate) {
      // Navegar al proceso de reserva con los parámetros de búsqueda
      this.router.navigate(['/process'], {
        queryParams: {
          startDate: this.bookingForm.startDate,
          endDate: this.bookingForm.endDate,
          
        }
      });
    } else {
      alert('Por favor, selecciona las fechas de inicio y fin de la estancia.');
    }
  }

}
