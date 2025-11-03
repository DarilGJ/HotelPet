// Valores del enum del backend
export type EmployeeStatus = 'active' | 'inactive';

export interface Employee {
  id?: number;
  name: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  salary: number;
  hiringDate: Date;
  status: EmployeeStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface EmployeeCreateRequest {
  name: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  salary: number;
  hiringDate: Date;
  status: EmployeeStatus;
}

export interface EmployeeUpdateRequest {
  name?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  position?: string;
  salary?: number;
  hiringDate?: Date;
  status?: EmployeeStatus;
}
