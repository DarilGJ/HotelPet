import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee, EmployeeCreateRequest, EmployeeUpdateRequest } from '../models/employee.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = `${environment.apiUrl}/employees`;

  constructor(private http: HttpClient) { }

  getAllEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.apiUrl);
  }

  getEmployeeById(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/${id}`);
  }

  createEmployee(employee: EmployeeCreateRequest): Observable<Employee> {
    // Preparar los datos para enviar al backend
    // Manejar la fecha: puede venir como Date, string o undefined
    let hiringDateFormatted: string;
    if (employee.hiringDate instanceof Date) {
      hiringDateFormatted = employee.hiringDate.toISOString().split('T')[0];
    } else if (typeof employee.hiringDate === 'string') {
      // Si ya es string, usar directamente (formato YYYY-MM-DD)
      hiringDateFormatted = employee.hiringDate;
    } else {
      // Si no hay fecha, usar la fecha actual
      hiringDateFormatted = new Date().toISOString().split('T')[0];
    }
    
    const payload: any = {
      name: employee.name,
      lastName: employee.lastName,
      email: employee.email,
      phone: employee.phone,
      position: employee.position,
      salary: employee.salary,
      hiringDate: hiringDateFormatted,
      status: employee.status
    };
    
    // Si el backend aún usa isActive en lugar de status, agregarlo también
    // payload.isActive = employee.status === 'activo';
    
    console.log('Payload enviado al backend:', payload);
    
    return this.http.post<Employee>(this.apiUrl, payload);
  }

  updateEmployee(id: number, employee: EmployeeUpdateRequest): Observable<Employee> {
    // Preparar los datos para enviar al backend (similar a create)
    const payload: any = { ...employee };
    
    // Manejar la fecha si está presente
    if (employee.hiringDate) {
      if (employee.hiringDate instanceof Date) {
        payload.hiringDate = employee.hiringDate.toISOString().split('T')[0];
      } else if (typeof employee.hiringDate === 'string') {
        payload.hiringDate = employee.hiringDate;
      }
    }
    
    console.log('Payload de actualización enviado al backend:', payload);
    
    return this.http.put<Employee>(`${this.apiUrl}/${id}`, payload);
  }

  deleteEmployee(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
