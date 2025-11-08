import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { Room } from '../../../models/room.model';
import { Service as PetService } from '../../../models/service.model';
import { RoomService } from '../../../services/room.service';
import { ServiceService } from '../../../services/service.service';
import { BehaviorSubject, Observable, combineLatest, map, shareReplay } from 'rxjs';

@Component({
  selector: 'app-seleccion-habitacion',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './seleccion-habitacion.component.html',
  styleUrls: ['./seleccion-habitacion.component.scss']
})
export class SeleccionHabitacionComponent implements OnInit {
  rooms$!: Observable<Room[]>;
  services$!: Observable<PetService[]>;
  filteredRooms$!: Observable<Room[]>;

  private selectedTypeSubject = new BehaviorSubject<string | null>(null);
  selectedType$ = this.selectedTypeSubject.asObservable();

  // Derived list of unique room types from backend data (robust to enum changes)
  roomTypes$!: Observable<string[]>;

  constructor(
    private roomService: RoomService,
    private serviceService: ServiceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.rooms$ = this.roomService.getAllRooms().pipe(shareReplay(1));
    this.services$ = this.serviceService.getAllServices().pipe(shareReplay(1));

    this.roomTypes$ = this.rooms$.pipe(
      map((rooms) => Array.from(new Set(rooms.map((r) => (r.type as unknown as string) || ''))).filter(Boolean))
    );

    this.filteredRooms$ = combineLatest([this.rooms$, this.selectedType$]).pipe(
      map(([rooms, selected]) => {
        if (!selected) return rooms;
        return rooms.filter((r) => String(r.type).toLowerCase() === selected.toLowerCase());
      })
    );
  }

  selectType(type: string | null): void {
    this.selectedTypeSubject.next(type);
  }

  getTypeLabel(type: string): string {
    const key = type.toLowerCase();
    const labels: Record<string, string> = {
      single: 'Junior',
      double: 'Deluxe',
      suite: 'Presidential'
    };
    return labels[key] || this.capitalize(type);
  }

  capitalize(text: string): string {
    return text ? text.charAt(0).toUpperCase() + text.slice(1) : text;
  }

  goToHome(): void {
    this.router.navigate(['/']);
  }
}


