import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReservationService } from '../../services/reservation.service';
import { RoomService } from '../../services/room.service';
import { CustomerService } from '../../services/customer.service';
import { StripeService } from '../../services/stripe.service';
import { AuthService } from '../../services/auth.service';
import { Room } from '../../models/room.model';
import { Customer } from '../../models/customer.model';
import { ReservationCreateRequest, ReservationStatus } from '../../models/reservation.model';
import { AvailableRoomsComponent } from '../service-process/available-rooms/available-rooms.component';
import { NavbarComponent } from '../landing/navbar/navbar.component';
import { FooterComponent } from '../landing/footer/footer.component';

@Component({
  selector: 'app-confirm-reservation',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, AvailableRoomsComponent, NavbarComponent, FooterComponent],
  templateUrl: './confirm-reservation.component.html',
  styleUrl: './confirm-reservation.component.scss'
})
export class ConfirmReservationComponent implements OnInit, OnDestroy {
  reservationForm: FormGroup;
  room: Room | null = null;
  customer: Customer | null = null;
  customers: Customer[] = [];
  selectedCustomerId: number | null = null;
  loading = false;
  reservationCreated = false;
  errorMessage = '';
  
  // Datos de la búsqueda
  searchParams: any = {};
  
  // Servicios adicionales con precios
  additionalServices = [
    { id: 1, name: 'Grooming Service', price: 50, selected: false },
    { id: 2, name: 'Bath', price: 30, selected: false },
    { id: 3, name: 'Deworming', price: 20, selected: false },
    { id: 4, name: 'Special Nutrition', price: 15, selected: false },
    { id: 5, name: 'Daily Walks', price: 25, selected: false },
    { id: 6, name: 'Veterinarian', price: 75, selected: false },
    { id: 7, name: 'Massage', price: 40, selected: false },
    { id: 8, name: 'Manicure', price: 10, selected: false },
    { id: 9, name: 'Pedicure', price: 10, selected: false }
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private reservationService: ReservationService,
    private roomService: RoomService,
    private customerService: CustomerService,
    private stripeService: StripeService,
    private authService: AuthService
  ) {
    this.reservationForm = this.fb.group({
      cardholderName: ['', [Validators.required]],
      customerName: [''], // No requerido inicialmente
      customerEmail: [''], // No requerido inicialmente
      customerPhone: [''], // No requerido inicialmente
      petName: ['', [Validators.required]],
      petBreed: ['', [Validators.required]],
      observation: ['']
    });
  }

  ngOnInit(): void {
    // Cargar lista de clientes
    this.loadCustomers();
    
    // Inicializar Stripe
    this.initializeStripe();
    
    // Obtener parámetros de la URL
    this.route.queryParams.subscribe(params => {
      this.searchParams = params;
      
      // Debug: mostrar los parámetros recibidos
      console.log('ConfirmReservation - Parámetros de búsqueda recibidos:', params);
      console.log('ConfirmReservation - startDate:', params['startDate']);
      console.log('ConfirmReservation - endDate:', params['endDate']);
      console.log('ConfirmReservation - roomId:', params['roomId']);
      console.log('ConfirmReservation - roomType:', params['roomType']);
      console.log('ConfirmReservation - roomPrice:', params['roomPrice']);
      
      // Verificar que las fechas estén presentes
      if (!params['startDate'] || !params['endDate']) {
        console.warn('ConfirmReservation - Fechas no encontradas en los parámetros');
        console.warn('ConfirmReservation - Parámetros disponibles:', Object.keys(params));
      } else {
        console.log('ConfirmReservation - Fechas encontradas correctamente');
      }
      
      if (params['roomId']) {
        this.loadRoomData(params['roomId']);
      }
    });
  }

  ngOnDestroy(): void {
    // Limpiar elementos de Stripe al destruir el componente
    this.stripeService.destroyElements();
  }

  loadCustomers(): void {
    this.customerService.getAllCustomers().subscribe({
      next: (customers) => {
        this.customers = customers;
        console.log('Clientes cargados:', customers);
        
        // Auto-seleccionar el cliente logueado
        this.loadCurrentUserCustomer();
      },
      error: (error) => {
        console.error('Error loading customers:', error);
        this.errorMessage = 'Error al cargar la lista de clientes';
      }
    });
  }

  loadCurrentUserCustomer(): void {
    // Primero intentar obtener el usuario actual desde el backend
    this.authService.getCurrentUser().subscribe({
      next: (currentUser) => {
        console.log('Usuario actual obtenido:', currentUser);
        
        if (currentUser.customerId) {
          // Si el usuario tiene un customerId, buscar ese cliente
          const loggedInCustomer = this.customers.find(c => c.id === currentUser.customerId);
          if (loggedInCustomer) {
            this.selectCustomerAutomatically(loggedInCustomer);
          }
        } else {
          // Si no tiene customerId, buscar por email
          const loggedInCustomer = this.customers.find(c => c.email === currentUser.email);
          if (loggedInCustomer) {
            this.selectCustomerAutomatically(loggedInCustomer);
          }
        }
      },
      error: (error) => {
        console.warn('No se pudo obtener el usuario actual, intentando por email del token:', error);
        
        // Fallback: buscar por email del token
        const userEmail = this.authService.getEmailFromToken();
        if (userEmail) {
          const loggedInCustomer = this.customers.find(c => c.email === userEmail);
          if (loggedInCustomer) {
            this.selectCustomerAutomatically(loggedInCustomer);
          }
        }
      }
    });
  }

  selectCustomerAutomatically(customer: Customer): void {
    if (!customer || !customer.id) {
      return;
    }

    console.log('Auto-seleccionando cliente logueado:', customer);
    
    this.selectedCustomerId = customer.id;
    this.customer = customer;
    
    // Auto-completar los campos del formulario
    this.reservationForm.patchValue({
      customerName: customer.name,
      customerEmail: customer.email,
      customerPhone: customer.phone,
      cardholderName: `${customer.name} ${customer.lastName}`.trim() // Auto-completar nombre del titular
    });
    
    console.log('Cliente auto-seleccionado y campos completados');
  }

  loadRoomData(roomId: number): void {
    this.roomService.getRoomById(roomId).subscribe({
      next: (room) => {
        this.room = room;
      },
      error: (error) => {
        console.error('Error loading room:', error);
        this.errorMessage = 'Error al cargar los datos de la habitación';
      }
    });
  }

  onCustomerSelect(event: any): void {
    const customerId = +event.target.value;
    this.selectedCustomerId = customerId;
    const customer = this.customers.find(c => c.id === customerId);
    
    if (customer) {
      this.customer = customer;
      // Auto-completar los campos del formulario
      this.reservationForm.patchValue({
        customerName: customer.name,
        customerEmail: customer.email,
        customerPhone: customer.phone
      });
      
      console.log('Cliente seleccionado:', customer);
    }
  }

  toggleService(serviceId: number): void {
    const service = this.additionalServices.find(s => s.id === serviceId);
    if (service) {
      service.selected = !service.selected;
    }
  }

  getSelectedServicesTotal(): number {
    return this.additionalServices
      .filter(service => service.selected)
      .reduce((total, service) => total + service.price, 0);
  }

  getSubtotal(): number {
    if (!this.room || !this.searchParams.startDate || !this.searchParams.endDate) {
      return 0;
    }
    
    const startDate = new Date(this.searchParams.startDate);
    const endDate = new Date(this.searchParams.endDate);
    const nights = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    return (this.room.price * nights) + this.getSelectedServicesTotal();
  }

  getIva(): number {
    return this.getSubtotal() * 0.12; // IVA fijo al 12%
  }

  getTotal(): number {
    return this.getSubtotal() + this.getIva();
  }

  getNightsCount(): number {
    if (!this.searchParams.startDate || !this.searchParams.endDate) {
      return 0;
    }
    
    const startDate = new Date(this.searchParams.startDate);
    const endDate = new Date(this.searchParams.endDate);
    
    // Validar que las fechas sean válidas
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return 0;
    }
    
    // Calcular la diferencia en días y asegurar que sea al menos 1 noche
    const timeDiff = endDate.getTime() - startDate.getTime();
    const nights = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    
    return nights > 0 ? nights : 1; // Mínimo 1 noche
  }

  // Getter para debuggear las fechas
  get debugDates() {
    return {
      startDate: this.searchParams.startDate,
      endDate: this.searchParams.endDate,
      startDateFormatted: this.formatDate(this.searchParams.startDate),
      endDateFormatted: this.formatDate(this.searchParams.endDate)
    };
  }

  // Método para obtener las fechas de manera segura
  getCheckInDate(): string {
    if (this.searchParams && this.searchParams.startDate) {
      console.log('getCheckInDate - Fecha encontrada:', this.searchParams.startDate);
      return this.formatDate(this.searchParams.startDate);
    }
    console.warn('getCheckInDate - Fecha no encontrada en searchParams:', this.searchParams);
    return 'Fecha no disponible';
  }

  getCheckOutDate(): string {
    if (this.searchParams && this.searchParams.endDate) {
      console.log('getCheckOutDate - Fecha encontrada:', this.searchParams.endDate);
      return this.formatDate(this.searchParams.endDate);
    }
    console.warn('getCheckOutDate - Fecha no encontrada en searchParams:', this.searchParams);
    return 'Fecha no disponible';
  }

  formatDate(dateString: string): string {
    if (!dateString) {
      console.log('formatDate: dateString está vacío o undefined');
      return 'Fecha no disponible';
    }
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        console.log('formatDate: fecha inválida para:', dateString);
        return 'Fecha inválida';
      }
      
      const formattedDate = date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      console.log('formatDate: fecha formateada correctamente:', dateString, '->', formattedDate);
      return formattedDate;
    } catch (error) {
      console.error('Error formateando fecha:', error, 'para:', dateString);
      return 'Error en fecha';
    }
  }

  async onSubmit(): Promise<void> {
    if (this.reservationForm.valid && this.room && this.selectedCustomerId) {
      this.loading = true;
      this.errorMessage = '';

      try {
        // Procesar pago con Stripe
        await this.processStripePayment();
        
        // Crear la reserva después del pago exitoso
        await this.createReservation();
      } catch (error) {
        console.error('Error procesando la reserva:', error);
        this.errorMessage = 'Error procesando la reserva. Por favor, inténtalo de nuevo.';
        this.loading = false;
      }
    } else {
      this.errorMessage = 'Por favor, completa todos los campos requeridos y selecciona un cliente.'+ this.errorMessage;
    }
  }

  goBack(): void {
    this.router.navigate(['/process'], { queryParams: this.searchParams });
  }

  // Inicializar Stripe
  async initializeStripe(): Promise<void> {
    try {
      console.log('Inicializando Stripe...');
      await this.stripeService.initializeStripe();
      console.log('Stripe inicializado correctamente');
      
      console.log('Creando elementos de Stripe...');
      await this.stripeService.createElements();
      console.log('Elementos de Stripe creados');
      
      console.log('Montando elemento de tarjeta...');
      this.stripeService.mountCardElement('card-element');
      console.log('Elemento de tarjeta montado');
      
      // Agregar listener para errores de Stripe
      this.setupStripeEventListeners();
    } catch (error) {
      console.error('Error inicializando Stripe:', error);
      this.errorMessage = `Error inicializando el sistema de pagos: ${error}`;
    }
  }

  // Configurar listeners de eventos de Stripe
  setupStripeEventListeners(): void {
    // Este método se implementará cuando tengamos acceso directo al cardElement
    // Por ahora, los errores se manejarán en el método confirmPayment
  }

  // Procesar pago con Stripe
  async processStripePayment(): Promise<void> {
    try {
      // Validar datos antes de crear PaymentIntent
      if (!this.room?.id) {
        throw new Error('ID de habitación no disponible');
      }
      
      if (!this.selectedCustomerId) {
        throw new Error('Cliente no seleccionado');
      }
      
      if (!this.searchParams.startDate || !this.searchParams.endDate) {
        throw new Error('Fechas de reserva no disponibles');
      }

      const totalAmount = this.getTotal();
      if (totalAmount <= 0) {
        throw new Error('El monto total debe ser mayor a 0');
      }

      // Crear PaymentIntent en el backend
      const paymentData = {
        amount: totalAmount,
        currency: 'usd',
        description: `Reserva para ${this.room?.type} - Hotel Pets`,
        metadata: {
          roomId: this.room?.id,
          customerId: this.selectedCustomerId,
          startDate: this.searchParams.startDate,
          endDate: this.searchParams.endDate
        }
      };

      console.log('Creando PaymentIntent con datos:', paymentData);
      
      const paymentIntent = await this.stripeService.createPaymentIntent(paymentData).toPromise();
      
      if (!paymentIntent) {
        throw new Error('No se pudo crear el PaymentIntent');
      }

      if (!paymentIntent.clientSecret) {
        throw new Error('ClientSecret no recibido del backend');
      }

      console.log('PaymentIntent creado:', paymentIntent);

      // Confirmar el pago con Stripe
      const result = await this.stripeService.confirmPayment(paymentIntent.clientSecret);
      
      if (!result.success) {
        throw new Error(result.error || 'Error procesando el pago');
      }

      console.log('Pago confirmado exitosamente:', result.paymentIntent);
    } catch (error: any) {
      console.error('Error en el procesamiento del pago:', error);
      this.errorMessage = `Error en el pago: ${error.message}`;
      throw error;
    }
  }


  // Crear reserva
  async createReservation(): Promise<void> {
    if (!this.room) {
      this.errorMessage = 'Datos de habitación no disponibles';
      return;
    }

    if (!this.selectedCustomerId) {
      this.errorMessage = 'Por favor, selecciona un cliente';
      return;
    }

    try {
      // Usar el cliente seleccionado
      const customer = this.customers.find(c => c.id === this.selectedCustomerId);
      
      if (!customer || !customer.id) {
        throw new Error('Cliente seleccionado no válido');
      }

      console.log('Usando cliente seleccionado:', customer);

      // Crear la reserva con el ID del cliente seleccionado
      const reservationData: ReservationCreateRequest = {
        startDate: new Date(this.searchParams.startDate),
        endDate: new Date(this.searchParams.endDate),
        status: ReservationStatus.CONFIRMED,
        observation: this.reservationForm.get('observation')?.value || '',
        subTotal: this.getSubtotal(),
        iva: this.getIva(),
        total: this.getTotal(),
        customerId: customer.id,
        roomId: this.room.id!,
        employeeId: 1 // Por ahora usar ID fijo del empleado
      };

      console.log('Creando reserva con datos:', reservationData);
      const reservation = await this.reservationService.createReservation(reservationData).toPromise();
      
      if (reservation && reservation.id) {
        this.loading = false;
        this.reservationCreated = true;
        
        // Redirigir a la página de pago exitoso con los datos de la reserva
        const petName = this.reservationForm.get('petName')?.value || '';
        const petBreed = this.reservationForm.get('petBreed')?.value || '';
        
        this.router.navigate(['/payment-success'], {
          queryParams: {
            reservationId: reservation.id,
            petName: petName,
            petBreed: petBreed
          }
        });
      }
    } catch (error) {
      console.error('Error creando reserva:', error);
      this.errorMessage = 'Error creando la reserva. Por favor, inténtalo de nuevo.';
      this.loading = false;
    }
  }

}
