import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Customer, CustomerCreateRequest } from '../../models/customer.model';
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
  
  newCustomer: CustomerCreateRequest = {
    name: '',
    email: '',
    phone: '',
    address: ''
  };

  constructor(private customerService: CustomerService) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.customerService.getAllCustomers().subscribe({
      next: (customers) => this.customers = customers,
      error: (error) => console.error('Error loading customers:', error)
    });
  }

  addCustomer(): void {
    this.customerService.createCustomer(this.newCustomer).subscribe({
      next: () => {
        this.loadCustomers();
        this.resetForm();
        this.showAddForm = false;
      },
      error: (error) => console.error('Error creating customer:', error)
    });
  }

  editCustomer(customer: Customer): void {
    this.editingCustomer = { ...customer };
    this.showAddForm = true;
  }

  updateCustomer(): void {
    if (this.editingCustomer) {
      this.customerService.updateCustomer(this.editingCustomer.id!, this.editingCustomer).subscribe({
        next: () => {
          this.loadCustomers();
          this.resetForm();
          this.showAddForm = false;
        },
        error: (error) => console.error('Error updating customer:', error)
      });
    }
  }

  deleteCustomer(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este cliente?')) {
      this.customerService.deleteCustomer(id).subscribe({
        next: () => this.loadCustomers(),
        error: (error) => console.error('Error deleting customer:', error)
      });
    }
  }

  cancelEdit(): void {
    this.resetForm();
    this.showAddForm = false;
  }

  private resetForm(): void {
    this.newCustomer = {
      name: '',
      email: '',
      phone: '',
      address: ''
    };
    this.editingCustomer = null;
  }
}
