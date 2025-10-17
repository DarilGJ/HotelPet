import { Customer } from './customer.model';
import { Room } from './room.model';
import { Employee } from './employee.model';

export interface Reservation {
  id?: number;
  startDate: Date;
  endDate: Date;
  checkInDate?: Date;
  checkOutDate?: Date;
  status: ReservationStatus;
  observation?: string;
  subTotal: number;
  iva: number; // IVA fijo al 12%
  total: number;
  customerId: number;
  roomId: number;
  employeeId: number;
  customer?: Customer; // Customer object
  room?: Room; // Room object
  employee?: Employee; // Employee object
}

export enum ReservationStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  IN_PROGRESS = 'inProgress',
  COMPLETED = 'completed',
  CANCELED = 'canceled'
}

export interface ReservationCreateRequest {
  startDate: Date;
  endDate: Date;
  checkInDate?: Date;
  checkOutDate?: Date;
  status: ReservationStatus;
  observation?: string;
  subTotal: number;
  iva: number; // IVA fijo al 12%
  total: number;
  customerId: number;
  roomId: number;
  employeeId: number;
}

export interface ReservationUpdateRequest {
  startDate?: Date;
  endDate?: Date;
  checkInDate?: Date;
  checkOutDate?: Date;
  status?: ReservationStatus;
  observation?: string;
  subTotal?: number;
  iva?: number; // IVA fijo al 12%
  total?: number;
  customerId?: number;
  roomId?: number;
  employeeId?: number;
}
