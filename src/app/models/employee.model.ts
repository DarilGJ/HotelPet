export interface Employee {
  id?: number;
  name: string;
  email: string;
  phone: string;
  position: string;
  salary: number;
  hiringDate: Date;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface EmployeeCreateRequest {
  name: string;
  email: string;
  phone: string;
  position: string;
  salary: number;
  hiringDate: Date;
  isActive: boolean;
}

export interface EmployeeUpdateRequest {
  name?: string;
  email?: string;
  phone?: string;
  position?: string;
  salary?: number;
  hireDate?: Date;
  isActive?: boolean;
}
