export interface Customer {
  id?: number;
  name: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  dpi: string;
  registrationDate: Date;
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CustomerCreateRequest {
  name: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  dpi: string;
  registrationDate: Date;
  status: string;
}

export interface CustomerUpdateRequest {
  name?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  dpi?: string;
  status?: string;
}
