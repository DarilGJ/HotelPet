import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Customer, CustomerCreateRequest, CustomerUpdateRequest } from '../../models/customer.model';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {
  customers: Customer[] = [];
  showAddForm = false;
  editingCustomer: Customer | null = null;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  customerToUpdate: CustomerUpdateRequest = {
    name: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    dpi: '',
    status: 'active'
  };
  
  newCustomer: CustomerCreateRequest = {
    name: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    dpi: '',
    registrationDate: new Date(),
    status: 'active'
  };

  constructor(private customerService: CustomerService) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.customerService.getAllCustomers().subscribe({
      next: (customers) => {
        this.customers = customers;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading customers:', error);
        this.errorMessage = 'Error al cargar los clientes';
        this.isLoading = false;
      }
    });
  }
  

  addCustomer(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    
    this.customerService.createCustomer(this.newCustomer).subscribe({
      next: () => {
        this.loadCustomers();
        this.resetForm();
        this.showAddForm = false;
        this.successMessage = 'Cliente creado exitosamente';
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error creating customer:', error);
        this.errorMessage = 'Error al crear el cliente';
        this.isLoading = false;
      }
    });
  }

  editCustomer(customer: Customer): void {
    this.editingCustomer = { ...customer };
    this.customerToUpdate = { 
      name: customer.name,
      lastName: customer.lastName,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      dpi: customer.dpi,
      status: customer.status
    };
    this.showAddForm = true;
    this.errorMessage = '';
    this.successMessage = '';
  }

  updateCustomer(): void {
    if (this.editingCustomer && this.editingCustomer.id) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      this.customerService.updateCustomer(this.editingCustomer.id, this.customerToUpdate).subscribe({
        next: () => {
          this.loadCustomers();
          this.resetForm();
          this.showAddForm = false;
          this.successMessage = 'Cliente actualizado exitosamente';
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error updating customer:', error);
          this.errorMessage = 'Error al actualizar el cliente';
          this.isLoading = false;
        }
      });
    } else {
      this.errorMessage = 'No se ha seleccionado un cliente para editar';
    }
  }

  deleteCustomer(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este cliente?')) {
      this.isLoading = true;
      this.errorMessage = '';
      
      this.customerService.deleteCustomer(id).subscribe({
        next: () => {
          this.loadCustomers();
          this.successMessage = 'Cliente eliminado exitosamente';
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error deleting customer:', error);
          this.errorMessage = 'Error al eliminar el cliente';
          this.isLoading = false;
        }
      });
    }
  }

  cancelEdit(): void {
    this.resetForm();
    this.showAddForm = false;
    this.errorMessage = '';
    this.successMessage = '';
  }

  clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }

  private resetForm(): void {
    this.newCustomer = {
      name: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      dpi: '',
      registrationDate: new Date(),
      status: 'active'
    };
    this.customerToUpdate = {
      name: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      dpi: '',
      status: 'active'
    };
    this.editingCustomer = null;
  }
}
