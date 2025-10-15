export interface Room {
  id?: number;
  number: string;
  type: RoomType;
  capacity: number;
  price: number;
  isAvailable: boolean;
  description?: string;
  imageUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RoomCreateRequest {
  number: string;
  type: RoomType;
  capacity: number;
  price: number;
  isAvailable: boolean;
  description?: string;
  imageUrl?: string;
}

export interface RoomUpdateRequest {
  number?: string;
  type?: RoomType;
  capacity?: number;
  price?: number;
  isAvailable?: boolean;
  description?: string;
  imageUrl?: string;
}

export enum RoomType {
  SINGLE = 'Habitación Individual',
  DOUBLE = 'Habitación Doble',
  SUITE = 'Suite de Lujo',
  // End of Selection
}
