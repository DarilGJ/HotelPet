import { Component } from '@angular/core';
import { RouterOutlet, RouterModule, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Pet Hotel';
  isPublicPage = false;

  // Rutas públicas que no deben mostrar navbar/footer administrativo
  private publicRoutes = ['/', '/login', '/process', '/confirm-reservation', '/payment-success', '/seleccion-habitacion'];

  constructor(private router: Router) {
    // Verificar la ruta inicial
    this.checkCurrentRoute();
    
    // Escuchar cambios de ruta
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event) => {
        const url = (event as NavigationEnd).url.split('?')[0]; // Remover query params
        this.isPublicPage = this.publicRoutes.some(route => url === route);
      });
  }

  private checkCurrentRoute(): void {
    const url = this.router.url.split('?')[0]; // Remover query params
    this.isPublicPage = this.publicRoutes.some(route => url === route);
  }
}
