export enum RoomType {
  SINGLE = 'single',
  DOUBLE = 'double',
  SUITE = 'suite'
}

export enum RoomAvailability {
  AVAILABLE = 'available',
  OCCUPIED = 'occupied',
  MAINTENANCE = 'maintenance'
}

export interface Room {
  id?: number;
  number: string;
  type: RoomType;
  capacity: number;
  price: number;
  availability: RoomAvailability;
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
  availability: RoomAvailability;
  description?: string;
  imageUrl?: string;
}

export interface RoomUpdateRequest {
  number?: string;
  type?: RoomType;
  capacity?: number;
  price?: number;
  availability?: RoomAvailability;
  description?: string;
  imageUrl?: string;
}
