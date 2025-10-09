import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Room, RoomCreateRequest, RoomType } from '../../models/room.model';
import { RoomService } from '../../services/room.service';

@Component({
  selector: 'app-rooms',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss']
})
export class RoomsComponent implements OnInit {
  rooms: Room[] = [];
  showAddForm = false;
  editingRoom: Room | null = null;
  
  newRoom: RoomCreateRequest = {
    number: '',
    type: RoomType.SINGLE,
    capacity: 1,
    price: 0,
    isAvailable: true,
    description: ''
  };

  constructor(private roomService: RoomService) {}

  ngOnInit(): void {
    this.loadRooms();
  }

  loadRooms(): void {
    this.roomService.getAllRooms().subscribe({
      next: (rooms) => this.rooms = rooms,
      error: (error) => console.error('Error loading rooms:', error)
    });
  }

  addRoom(): void {
    this.roomService.createRoom(this.newRoom).subscribe({
      next: () => {
        this.loadRooms();
        this.resetForm();
        this.showAddForm = false;
      },
      error: (error) => console.error('Error creating room:', error)
    });
  }

  editRoom(room: Room): void {
    this.editingRoom = { ...room };
    this.showAddForm = true;
  }

  updateRoom(): void {
    if (this.editingRoom) {
      this.roomService.updateRoom(this.editingRoom.id!, this.editingRoom).subscribe({
        next: () => {
          this.loadRooms();
          this.resetForm();
          this.showAddForm = false;
        },
        error: (error) => console.error('Error updating room:', error)
      });
    }
  }

  deleteRoom(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta habitación?')) {
      this.roomService.deleteRoom(id).subscribe({
        next: () => this.loadRooms(),
        error: (error) => console.error('Error deleting room:', error)
      });
    }
  }

  cancelEdit(): void {
    this.resetForm();
    this.showAddForm = false;
  }

  private resetForm(): void {
    this.newRoom = {
      number: '',
      type: RoomType.SINGLE,
      capacity: 1,
      price: 0,
      isAvailable: true,
      description: ''
    };
    this.editingRoom = null;
  }
}
