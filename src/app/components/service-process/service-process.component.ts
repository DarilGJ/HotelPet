import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AvailableRoomsComponent } from './available-rooms/available-rooms.component';
import { LoginComponent } from '../login/login.component';
import { NavbarComponent } from '../landing/navbar/navbar.component';
import { FooterComponent } from '../landing/footer/footer.component';

@Component({
  selector: 'app-service-process',
  standalone: true,
  imports: [AvailableRoomsComponent, LoginComponent, NavbarComponent, FooterComponent],
  templateUrl: './service-process.component.html',
  styleUrl: './service-process.component.scss'
})
export class ServiceProcessComponent implements OnInit {
  searchParams: any = {};

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ){}

  ngOnInit(): void {
    // Obtener parámetros de la URL y pasarlos al componente hijo
    this.route.queryParams.subscribe(params => {
      this.searchParams = params;
      console.log('ServiceProcess - Parámetros recibidos:', params);
      console.log('ServiceProcess - startDate:', params['startDate']);
      console.log('ServiceProcess - endDate:', params['endDate']);
      console.log('ServiceProcess - Parámetros que se pasarán al hijo:', this.searchParams);
    });
  }

  goToProcess(){
    this.router.navigate(['/process']);
  }

  goToLogin(){
    // Guardar la URL actual para volver después del login
    this.router.navigate(['/login'], { 
      queryParams: { returnUrl: this.router.url } 
    });
  }
}
