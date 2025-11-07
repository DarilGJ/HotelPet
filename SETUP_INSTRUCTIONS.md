# Configuración del Proyecto Pet Hotel

## Backend (Express + Sequelize)

### 1. Configurar el Backend
Asegúrate de que tu backend esté ejecutándose en el puerto 3000 con las siguientes rutas:

```
POST   /api/customers/create
GET    /api/customers/
GET    /api/customers/:id/customer
PUT    /api/customers/:id/update
DELETE /api/customers/:id/delete
```

### 2. Estructura de Datos del Customer
Tu API debe manejar los siguientes campos:

```json
{
  "name": "string",
  "lastName": "string", 
  "email": "string",
  "phone": "string",
  "address": "string",
  "dpi": "string",
  "registrationDate": "date",
  "status": "string" // "active", "inactive", "suspended"
}
```

### 3. Configurar CORS
Asegúrate de que tu backend tenga CORS configurado para permitir requests desde `http://localhost:4200`:

```javascript
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}));
```

## Frontend (Angular)

### 1. Instalar Dependencias
```bash
npm install
```

### 2. Ejecutar el Servidor de Desarrollo
```bash
ng serve
```

### 3. Abrir en el Navegador
La aplicación estará disponible en `http://localhost:4200`

## Funcionalidades Implementadas

### Gestión de Clientes
- **Crear**: Formulario completo con todos los campos
- **Listar**: Tabla con todos los clientes y sus datos
- **Editar**: Formulario pre-llenado para modificar datos
- **Eliminar**: Confirmación antes de eliminar
- **Validación**: Campos requeridos y tipos de datos correctos

### Interfaz de Usuario
- **Diseño Responsivo**: Funciona en desktop y móvil
- **Formulario en Filas**: Campos organizados en columnas
- **Badges de Estado**: Indicadores visuales para el estado del cliente
- **Estilos Modernos**: Interfaz limpia y profesional

### Configuración Técnica
- **Modelos TypeScript**: Interfaces bien definidas
- **Servicios HTTP**: Comunicación con la API
- **Manejo de Errores**: Logs en consola para debugging
- **Configuración de Entorno**: URLs configurables

## Pruebas

1. **Iniciar el Backend**: Asegúrate de que tu servidor Express esté corriendo
2. **Iniciar el Frontend**: Ejecuta `ng serve`
3. **Navegar a Clientes**: Ve a la sección "Clientes" en el menú
4. **Probar CRUD**:
   - Crear un nuevo cliente
   - Ver la lista actualizada
   - Editar un cliente existente
   - Eliminar un cliente

## Solución de Problemas

### Error de CORS
Si ves errores de CORS, asegúrate de que tu backend tenga la configuración correcta.

### Error 404
Verifica que las rutas de tu API coincidan exactamente con las definidas en el servicio.

### Error de Conexión
Asegúrate de que el backend esté ejecutándose en el puerto 3000.

## Próximos Pasos

1. Implementar la misma funcionalidad para Empleados, Habitaciones, Servicios y Reservas
2. Agregar validaciones más robustas
3. Implementar paginación para listas grandes
4. Agregar búsqueda y filtros
5. Implementar notificaciones de éxito/error
