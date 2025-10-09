import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent {
  bookingForm = {
    startDate: '',
    endDate: '',
    petType: 'Perro'
  };

  constructor(private router: Router) {}

  onSubmit() {
    // Navegar a la página de reservas con los datos del formulario
    this.router.navigate(['/reservations'], { 
      queryParams: this.bookingForm 
    });
  }

  goToReservations() {
    this.router.navigate(['/reservations']);
  }

  goToLogin() {
    // Navegar a una página de login (puedes crear una o usar el dashboard)
    this.router.navigate(['/dashboard']);
  }
}
