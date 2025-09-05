export interface Service {
  id?: number;
  name: string;
  description: string;
  price: number;
  duration: number; // en minutos
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ServiceCreateRequest {
  name: string;
  description: string;
  price: number;
  duration: number;
  isActive: boolean;
}

export interface ServiceUpdateRequest {
  name?: string;
  description?: string;
  price?: number;
  duration?: number;
  isActive?: boolean;
}
