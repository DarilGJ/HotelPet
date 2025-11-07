# Configuración de Stripe para Pet Paradise

## Pasos para configurar Stripe

### 1. Obtener las claves de Stripe

1. Ve a [Stripe Dashboard](https://dashboard.stripe.com/)
2. Inicia sesión o crea una cuenta
3. Ve a "Developers" > "API keys"
4. Copia tu **Publishable key** (comienza con `pk_test_` para modo de prueba)

### 2. Configurar las claves en el proyecto

Edita el archivo `src/environments/stripe.environment.ts`:

```typescript
export const stripeConfig = {
  // Reemplaza con tu clave pública de Stripe
  publishableKey: 'pk_test_TU_CLAVE_AQUI', // Tu clave pública de Stripe
  
  // Configuración adicional
  currency: 'usd',
  locale: 'es'
};
```

### 3. Configurar el backend

Tu backend necesita implementar los siguientes endpoints:

#### POST `/api/stripe/create-payment-intent`
```json
{
  "amount": 1000, // Monto en centavos
  "currency": "usd",
  "customerEmail": "cliente@email.com"
}
```

**Respuesta:**
```json
{
  "clientSecret": "pi_xxx_secret_xxx",
  "paymentIntentId": "pi_xxx"
}
```

#### POST `/api/stripe/confirm-payment`
```json
{
  "paymentIntentId": "pi_xxx",
  "reservationId": 123
}
```

**Respuesta:**
```json
{
  "success": true,
  "paymentIntentId": "pi_xxx"
}
```

### 4. Ejemplo de implementación en Node.js/Express

```javascript
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Crear PaymentIntent
app.post('/api/stripe/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency, customerEmail } = req.body;
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      customer_email: customerEmail,
      metadata: {
        reservation_type: 'pet_hotel'
      }
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Confirmar pago
app.post('/api/stripe/confirm-payment', async (req, res) => {
  try {
    const { paymentIntentId, reservationId } = req.body;
    
    // Aquí puedes actualizar tu base de datos
    // marcando la reserva como pagada
    
    res.json({
      success: true,
      paymentIntentId
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### 5. Tarjetas de prueba

Para pruebas, usa estas tarjetas:

- **Éxito:** `4242 4242 4242 4242`
- **Declinada:** `4000 0000 0000 0002`
- **Requiere autenticación:** `4000 0025 0000 3155`

Usa cualquier fecha de vencimiento futura y cualquier CVC de 3 dígitos.

### 6. Variables de entorno

Asegúrate de configurar estas variables en tu backend:

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### 7. Flujo de pago

1. El usuario llena el formulario de reserva
2. Se crea un PaymentIntent en el backend
3. Se muestra el formulario de pago de Stripe
4. El usuario ingresa los datos de su tarjeta
5. Stripe procesa el pago
6. Si es exitoso, se crea la reserva
7. Se confirma el pago en el backend

### 8. Seguridad

- Nunca expongas tu clave secreta en el frontend
- Usa HTTPS en producción
- Valida los datos en el backend
- Implementa webhooks para manejar eventos de Stripe

### 9. Webhooks (Opcional pero recomendado)

Configura webhooks para manejar eventos como:
- `payment_intent.succeeded`
- `payment_intent.payment_failed`

Esto te permitirá manejar casos donde el pago se procesa pero hay problemas de red.
