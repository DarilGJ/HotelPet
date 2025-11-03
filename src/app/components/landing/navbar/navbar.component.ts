import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  constructor(private router: Router) {}

  goToReservation() {
    // Navegar a la página de reservas con los datos del formulario
    this.router.navigate(['/process']);
  }

  goToLogin() {
    // Navegar a la página de login
    this.router.navigate(['/login']);
  }

}
