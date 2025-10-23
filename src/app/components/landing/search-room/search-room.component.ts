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
    console.log('SearchRoom - Formulario de búsqueda:', this.bookingForm);
    console.log('SearchRoom - startDate:', this.bookingForm.startDate);
    console.log('SearchRoom - endDate:', this.bookingForm.endDate);
    
    if (this.bookingForm.startDate && this.bookingForm.endDate) {
      // Navegar al proceso de reserva con los parámetros de búsqueda
      const queryParams = {
        startDate: this.bookingForm.startDate,
        endDate: this.bookingForm.endDate,
      };
      
      console.log('SearchRoom - Navegando a /process con parámetros:', queryParams);
      
      this.router.navigate(['/process'], {
        queryParams: queryParams
      });
    } else {
      alert('Por favor, selecciona las fechas de inicio y fin de la estancia.');
    }
  }

}
