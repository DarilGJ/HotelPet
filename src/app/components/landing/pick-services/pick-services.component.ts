import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pick-services',
  standalone: true,
  imports: [],
  templateUrl: './pick-services.component.html',
  styleUrl: './pick-services.component.scss'
})
export class PickServicesComponent {
  constructor(private router: Router) {}
  
  goToServices() {
    this.router.navigate(['/services']);
  }

}
