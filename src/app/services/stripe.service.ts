import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { loadStripe, Stripe, StripeElements, StripeCardElement } from '@stripe/stripe-js';
import { stripeConfig } from '../../environments/stripe.environment';

export interface PaymentIntentRequest {
  amount: number;
  currency?: string;
  description?: string;
  metadata?: any;
}

export interface PaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
}

export interface PaymentResult {
  success: boolean;
  paymentIntentId?: string;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class StripeService {
  private apiUrl = `${environment.apiUrl}/stripe`;
  private stripe: Stripe | null = null;
  private elements: StripeElements | null = null;
  private cardElement: StripeCardElement | null = null;

  constructor(private http: HttpClient) { }

  /**
   * Inicializar Stripe
   */
  async initializeStripe(): Promise<void> {
    if (!this.stripe) {
      this.stripe = await loadStripe(stripeConfig.publicKey);
    }
  }

  /**
   * Crear elementos de Stripe
   */
  async createElements(): Promise<StripeElements | null> {
    if (!this.stripe) {
      await this.initializeStripe();
    }
    
    if (this.stripe) {
      this.elements = this.stripe.elements({
        appearance: {
          theme: 'stripe',
          variables: {
            colorPrimary: '#0570de',
            colorBackground: '#ffffff',
            colorText: '#30313d',
            colorDanger: '#df1b41',
            fontFamily: 'Ideal Sans, system-ui, sans-serif',
            spacingUnit: '2px',
            borderRadius: '4px',
          }
        }
      });
      
      this.cardElement = this.elements.create('card', {
        style: {
          base: {
            fontSize: '16px',
            color: '#424770',
            '::placeholder': {
              color: '#aab7c4',
            },
          },
        },
      });
    }
    
    return this.elements;
  }

  /**
   * Montar el elemento de tarjeta en el DOM
   */
  mountCardElement(elementId: string): void {
    if (this.cardElement) {
      this.cardElement.mount(`#${elementId}`);
      
      // Agregar listener para errores
      this.cardElement.on('change', (event: any) => {
        const displayError = document.getElementById('card-errors');
        if (event.error) {
          if (displayError) {
            displayError.textContent = event.error.message;
          }
        } else {
          if (displayError) {
            displayError.textContent = '';
          }
        }
      });
    }
  }

  /**
   * Obtener el elemento de tarjeta para manejar eventos
   */
  getCardElement(): StripeCardElement | null {
    return this.cardElement;
  }

  /**
   * Crear un PaymentIntent en el backend
   */
  createPaymentIntent(paymentData: PaymentIntentRequest): Observable<PaymentIntentResponse> {
    return this.http.post<PaymentIntentResponse>(`${this.apiUrl}/create-payment-intent`, paymentData);
  }

  /**
   * Confirmar el pago con Stripe
   */
  async confirmPayment(clientSecret: string): Promise<{ success: boolean; error?: string; paymentIntent?: any }> {
    if (!this.stripe || !this.cardElement) {
      console.error('Stripe no está inicializado:', { stripe: !!this.stripe, cardElement: !!this.cardElement });
      return { success: false, error: 'Stripe no está inicializado' };
    }

    try {
      console.log('Confirmando pago con clientSecret:', clientSecret);
      
      const { error, paymentIntent } = await this.stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: this.cardElement,
        }
      });

      if (error) {
        console.error('Error de Stripe al confirmar pago:', error);
        return { success: false, error: error.message };
      }

      console.log('Pago confirmado exitosamente:', paymentIntent);
      return { success: true, paymentIntent };
    } catch (error: any) {
      console.error('Error general al confirmar pago:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Obtener la clave pública de Stripe
   */
  getPublicKey(): Observable<{ publicKey: string }> {
    return this.http.get<{ publicKey: string }>(`${this.apiUrl}/public-key`);
  }

  /**
   * Limpiar elementos de Stripe
   */
  destroyElements(): void {
    if (this.cardElement) {
      this.cardElement.destroy();
      this.cardElement = null;
    }
    if (this.elements) {
      this.elements = null;
    }
  }
}
