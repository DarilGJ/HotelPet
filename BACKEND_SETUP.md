# Configuración del Backend para Hotel Pet

## Configuración de CORS

Para que tu frontend Angular se conecte correctamente con el backend, necesitas configurar CORS en tu servidor Node.js.

### 1. Instalar el paquete CORS

```bash
npm install cors
```

### 2. Configurar CORS en tu servidor principal (app.js o server.js)

```javascript
const express = require('express');
const cors = require('cors');
const app = express();

// Configurar CORS para permitir solicitudes desde el frontend
app.use(cors({
  origin: 'http://localhost:4200', // URL del frontend Angular
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // Si necesitas enviar cookies
}));

// Parsear JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Resto de tu configuración...
```

### 3. Estructura de rutas esperada

Tu backend debe tener las siguientes rutas configuradas:

```
/api/customers
/api/employees  
/api/rooms
/api/reservations
/api/services
```

Cada endpoint debe soportar:
- GET `/api/{resource}` - Obtener todos
- GET `/api/{resource}/:id` - Obtener por ID
- POST `/api/{resource}` - Crear nuevo
- PUT `/api/{resource}/:id` - Actualizar
- DELETE `/api/{resource}/:id` - Eliminar

### 4. Rutas adicionales específicas

- `GET /api/rooms/available` - Habitaciones disponibles
- `GET /api/reservations/customer/:customerId` - Reservas por cliente
- `GET /api/reservations/room/:roomId` - Reservas por habitación
- `GET /api/reservations/active` - Reservas activas
- `GET /api/services/active` - Servicios activos

### 5. Ejemplo de configuración completa

```javascript
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Rutas
app.use('/api/customers', require('./routes/customers'));
app.use('/api/employees', require('./routes/employees'));
app.use('/api/rooms', require('./routes/rooms'));
app.use('/api/reservations', require('./routes/reservations'));
app.use('/api/services', require('./routes/services'));

// Ruta de prueba
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend funcionando correctamente' });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
```

### 6. Verificación

Para verificar que todo funciona:

1. Inicia tu backend: `npm start` o `node server.js`
2. Inicia tu frontend: `ng serve`
3. Abre http://localhost:4200
4. Revisa la consola del navegador para errores

### 7. Solución de problemas comunes

- **Error CORS**: Verifica que CORS esté configurado correctamente
- **404 Not Found**: Verifica que las rutas coincidan exactamente
- **Connection refused**: Verifica que el backend esté corriendo en puerto 3000
