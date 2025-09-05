export interface Room {
  id?: number;
  number: string;
  type: string;
  capacity: number;
  price: number;
  isAvailable: boolean;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RoomCreateRequest {
  number: string;
  type: string;
  capacity: number;
  price: number;
  isAvailable: boolean;
  description?: string;
}

export interface RoomUpdateRequest {
  number?: string;
  type?: string;
  capacity?: number;
  price?: number;
  isAvailable?: boolean;
  description?: string;
}
