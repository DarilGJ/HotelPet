export interface Pet {
  id?: number;
  customerId: number;
  name: string;
  species: string;
  breed: string;
  age: number;
  weight: number;
  color: string;
  medicalNotes?: string;
  specialNeeds?: string;
  createdAt?: Date;
  updatedAt?: Date;
  customer?: any; // Customer object
}

export interface PetCreateRequest {
  customerId: number;
  name: string;
  species: string;
  breed: string;
  age: number;
  weight: number;
  color: string;
  medicalNotes?: string;
  specialNeeds?: string;
}

export interface PetUpdateRequest {
  customerId?: number;
  name?: string;
  species?: string;
  breed?: string;
  age?: number;
  weight?: number;
  color?: string;
  medicalNotes?: string;
  specialNeeds?: string;
}
