import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-service-process',
  standalone: true,
  imports: [],
  templateUrl: './service-process.component.html',
  styleUrl: './service-process.component.scss'
})
export class ServiceProcessComponent {

  constructor(private router: Router){}

  goToProcess(){
    this.router.navigate(['/process']);
  }
}
