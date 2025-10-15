import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { SearchRoomComponent } from './search-room/search-room.component';
import { PickRoomComponent } from './pick-room/pick-room.component';
import { PickServicesComponent } from './pick-services/pick-services.component';
import { FooterComponent } from './footer/footer.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [FormsModule, NavbarComponent, FooterComponent, SearchRoomComponent, PickRoomComponent, PickServicesComponent],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent {

  constructor(private router: Router) {}


  goToReservations() {
    this.router.navigate(['/reservations']);
  }

}
