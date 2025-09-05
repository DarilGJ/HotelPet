export interface Customer {
  id?: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CustomerCreateRequest {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface CustomerUpdateRequest {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
}
