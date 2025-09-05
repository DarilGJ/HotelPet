import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Service, ServiceCreateRequest } from '../../models/service.model';
import { ServiceService } from '../../services/service.service';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit {
  services: Service[] = [];
  showAddForm = false;
  editingService: Service | null = null;
  
  newService: ServiceCreateRequest = {
    name: '',
    description: '',
    price: 0,
    duration: 30,
    isActive: true
  };

  constructor(private serviceService: ServiceService) {}

  ngOnInit(): void {
    this.loadServices();
  }

  loadServices(): void {
    this.serviceService.getAllServices().subscribe({
      next: (services) => this.services = services,
      error: (error) => console.error('Error loading services:', error)
    });
  }

  addService(): void {
    this.serviceService.createService(this.newService).subscribe({
      next: () => {
        this.loadServices();
        this.resetForm();
        this.showAddForm = false;
      },
      error: (error) => console.error('Error creating service:', error)
    });
  }

  editService(service: Service): void {
    this.editingService = { ...service };
    this.showAddForm = true;
  }

  updateService(): void {
    if (this.editingService) {
      this.serviceService.updateService(this.editingService.id!, this.editingService).subscribe({
        next: () => {
          this.loadServices();
          this.resetForm();
          this.showAddForm = false;
        },
        error: (error) => console.error('Error updating service:', error)
      });
    }
  }

  deleteService(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este servicio?')) {
      this.serviceService.deleteService(id).subscribe({
        next: () => this.loadServices(),
        error: (error) => console.error('Error deleting service:', error)
      });
    }
  }

  cancelEdit(): void {
    this.resetForm();
    this.showAddForm = false;
  }

  private resetForm(): void {
    this.newService = {
      name: '',
      description: '',
      price: 0,
      duration: 30,
      isActive: true
    };
    this.editingService = null;
  }
}
