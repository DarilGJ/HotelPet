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
  
  // Posiciones disponibles
  availablePositions = ['Manager', 'receptionist', 'janitors', 'petSitter', 'veterinary', 'logistics', 'finance', 'HHRR'];
  
  // Estados disponibles (valores para el backend)
  availableStatuses = [
    { value: 'active', label: 'Activo' },
    { value: 'inactive', label: 'Inactivo' }
  ];
  
  newEmployee: any = {
    name: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    salary: 0,
    hiringDate: this.formatDateForInput(new Date()),
    status: 'active'
  };

  // Método para formatear fecha a formato YYYY-MM-DD para input type="date"
  private formatDateForInput(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

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
    // Validar que todos los campos requeridos estén llenos
    if (!this.newEmployee.name || !this.newEmployee.lastName || 
        !this.newEmployee.email || !this.newEmployee.phone || 
        !this.newEmployee.position || !this.newEmployee.salary) {
      alert('Por favor, completa todos los campos requeridos');
      return;
    }

    // Preparar los datos para enviar (convertir fecha string a Date)
    const employeeData: EmployeeCreateRequest = {
      name: this.newEmployee.name,
      lastName: this.newEmployee.lastName,
      email: this.newEmployee.email,
      phone: this.newEmployee.phone,
      position: this.newEmployee.position,
      salary: Number(this.newEmployee.salary),
      hiringDate: new Date(this.newEmployee.hiringDate), // Convertir string a Date
      status: this.newEmployee.status as 'active' | 'inactive'
    };

    console.log('Datos a enviar:', employeeData);
    
    this.employeeService.createEmployee(employeeData).subscribe({
      next: (response) => {
        console.log('Empleado creado exitosamente:', response);
        this.loadEmployees();
        this.resetForm();
        this.showAddForm = false;
      },
      error: (error) => {
        console.error('Error creando empleado:', error);
        const errorMessage = error?.error?.message || error?.message || 'Error al crear el empleado';
        alert(`Error: ${errorMessage}`);
        if (error.error) {
          console.error('Detalles del error:', error.error);
        }
      }
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
      lastName: '',
      email: '',
      phone: '',
      position: '',
      salary: 0,
      hiringDate: this.formatDateForInput(new Date()),
      status: 'active'
    };
    this.editingEmployee = null;
  }
}
