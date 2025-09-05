export interface Reservation {
  id?: number;
  customerId: number;
  roomId: number;
  checkIn: Date;
  checkOut: Date;
  totalPrice: number;
  status: ReservationStatus;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
  customer?: any; // Customer object
  room?: any; // Room object
}

export enum ReservationStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CHECKED_IN = 'checked_in',
  CHECKED_OUT = 'checked_out',
  CANCELLED = 'cancelled'
}

export interface ReservationCreateRequest {
  customerId: number;
  roomId: number;
  checkIn: Date;
  checkOut: Date;
  totalPrice: number;
  status: ReservationStatus;
  notes?: string;
}

export interface ReservationUpdateRequest {
  customerId?: number;
  roomId?: number;
  checkIn?: Date;
  checkOut?: Date;
  totalPrice?: number;
  status?: ReservationStatus;
  notes?: string;
}
