import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pick-room',
  standalone: true,
  imports: [],
  templateUrl: './pick-room.component.html',
  styleUrl: './pick-room.component.scss'
})
export class PickRoomComponent {

  constructor(private router: Router) {}

  goToRooms() {
    this.router.navigate(['/rooms']);
  }

}
