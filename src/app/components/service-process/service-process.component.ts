import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AvailableRoomsComponent } from './available-rooms/available-rooms.component';

@Component({
  selector: 'app-service-process',
  standalone: true,
  imports: [AvailableRoomsComponent],
  templateUrl: './service-process.component.html',
  styleUrl: './service-process.component.scss'
})
export class ServiceProcessComponent {

  constructor(private router: Router){}

  goToProcess(){
    this.router.navigate(['/process']);
  }


}
