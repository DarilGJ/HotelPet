import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Employee, EmployeeCreateRequest } from '../../models/employee.model';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent implements OnInit {
  employees: Employee[] = [];
  showAddForm = false;
  editingEmployee: Employee | null = null;
  
  newEmployee: EmployeeCreateRequest = {
    name: '',
    email: '',
    phone: '',
    position: '',
    salary: 0,
    hiringDate: new Date(),
    isActive: true
  };

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.employeeService.getAllEmployees().subscribe({
      next: (employees) => this.employees = employees,
      error: (error) => console.error('Error loading employees:', error)
    });
  }

  addEmployee(): void {
    this.employeeService.createEmployee(this.newEmployee).subscribe({
      next: () => {
        this.loadEmployees();
        this.resetForm();
        this.showAddForm = false;
      },
      error: (error) => console.error('Error creating employee:', error)
    });
  }

  editEmployee(employee: Employee): void {
    this.editingEmployee = { ...employee };
    this.showAddForm = true;
  }

  updateEmployee(): void {
    if (this.editingEmployee) {
      this.employeeService.updateEmployee(this.editingEmployee.id!, this.editingEmployee).subscribe({
        next: () => {
          this.loadEmployees();
          this.resetForm();
          this.showAddForm = false;
        },
        error: (error) => console.error('Error updating employee:', error)
      });
    }
  }

  deleteEmployee(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este empleado?')) {
      this.employeeService.deleteEmployee(id).subscribe({
        next: () => this.loadEmployees(),
        error: (error) => console.error('Error deleting employee:', error)
      });
    }
  }

  cancelEdit(): void {
    this.resetForm();
    this.showAddForm = false;
  }

  private resetForm(): void {
    this.newEmployee = {
      name: '',
      email: '',
      phone: '',
      position: '',
      salary: 0,
      hiringDate: new Date(),
      isActive: true
    };
    this.editingEmployee = null;
  }
}
