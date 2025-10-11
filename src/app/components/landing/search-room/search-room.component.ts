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
    endDate: ''
  };

    constructor(private router: Router) {}

  goToSearchRoom() {
    this.router.navigate(['/rooms']);
  }

}
