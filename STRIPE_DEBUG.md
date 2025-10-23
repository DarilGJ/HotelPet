# Debug de Stripe - Guía de Verificación

## Pasos para Verificar la Configuración de Stripe

### 1. Verificar Claves API
- ✅ Clave pública configurada: `pk_test_51SLDxzQrbkx69jtXPeAsIlYbALOhpd2LFxfNYzU5YdNdb40zpVdvBPbPPsXSuZrpxS1xYhDbj38ymVluqDoTXKKR00mgInKiCY`
- ✅ Formato correcto: Comienza con `pk_test_`
- ⚠️ **IMPORTANTE**: Asegúrate de que tu backend tenga la clave secreta correspondiente (`sk_test_...`)

### 2. Verificar Backend
Asegúrate de que tu backend tenga:
- Endpoint: `POST /api/stripe/create-payment-intent`
- Clave secreta de Stripe configurada
- Manejo correcto de metadata

### 3. Verificar en Consola del Navegador
Cuando ejecutes el pago, deberías ver estos logs:
```
Inicializando Stripe...
Stripe inicializado correctamente
Creando elementos de Stripe...
Elementos de Stripe creados
Montando elemento de tarjeta...
Elemento de tarjeta montado
Creando PaymentIntent con datos: {...}
PaymentIntent creado: {...}
Confirmando pago con clientSecret: pi_...
Pago confirmado exitosamente: {...}
```

### 4. Posibles Errores Comunes

#### Error: "Stripe no está inicializado"
- Verifica que la clave pública sea correcta
- Verifica que no haya errores de CORS
- Verifica que el script de Stripe se cargue correctamente

#### Error: "No se pudo crear el PaymentIntent"
- Verifica que el backend esté ejecutándose
- Verifica que el endpoint `/api/stripe/create-payment-intent` exista
- Verifica que la clave secreta esté configurada en el backend

#### Error: "ClientSecret no recibido del backend"
- Verifica la respuesta del backend
- Verifica que el backend esté retornando el formato correcto

### 5. Datos de Prueba para Stripe
- **Número de tarjeta**: 4242 4242 4242 4242
- **Fecha de vencimiento**: Cualquier fecha futura (ej: 12/25)
- **CVV**: Cualquier número de 3 dígitos (ej: 123)
- **Código postal**: Cualquier código postal (ej: 12345)

### 6. Verificar Configuración del Proxy
El archivo `proxy.conf.json` debe estar configurado para redirigir `/api/*` a tu backend.

### 7. Comandos para Ejecutar
```bash
# Asegúrate de que el backend esté ejecutándose en el puerto 3000
# Luego ejecuta el frontend
ng serve
```

### 8. Verificar en Network Tab
- Busca la petición a `/api/stripe/create-payment-intent`
- Verifica que la respuesta contenga `clientSecret`
- Verifica que no haya errores 404 o 500
