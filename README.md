# Pet Hotel Management - Frontend

Aplicación web frontend para la gestión integral de un hotel para mascotas, desarrollada con Angular 17. El sistema permite a los clientes realizar reservas en línea y a los administradores gestionar todas las operaciones del hotel.

## Tabla de Contenidos

- [Características](#características)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Rutas y Navegación](#rutas-y-navegación)
- [Autenticación](#autenticación)
- [Componentes Principales](#componentes-principales)
- [Servicios](#servicios)
- [Scripts Disponibles](#scripts-disponibles)
- [Desarrollo](#desarrollo)
- [Despliegue](#despliegue)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Documentación Adicional](#documentación-adicional)

## Características

- **Angular 17** con arquitectura standalone components
- **TypeScript** para tipado estático y mayor seguridad
- **SCSS** para estilos modulares y reutilizables
- **Diseño Responsive** para dispositivos móviles, tablets y desktop
- **Sistema de Autenticación** con JWT y guards de protección de rutas
- **Integración con Stripe** para procesamiento de pagos
- **Componentes Modulares** para cada entidad del sistema
- **Lazy Loading** para optimización de carga
- **Proxy Configuration** para desarrollo local
- **Interceptores HTTP** para manejo automático de tokens

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (versión 18 o superior)
- **npm** (versión 9 o superior) o **yarn**
- **Angular CLI** (versión 17)
- **Backend API** ejecutándose en `http://localhost:3000`

### Instalación de Angular CLI

```bash
npm install -g @angular/cli@17
```

## Instalación

1. **Clonar el repositorio** 
```bash
git clone <repository-url>
cd frontend
```

2. **Instalar dependencias**:
```bash
npm install
```

3. **Verificar la configuración del backend**:
   - Asegúrate de que el backend esté ejecutándose en `http://localhost:3000`
   - El proxy está configurado en `proxy.conf.json` para redirigir las peticiones `/api/*` al backend

4. **Configurar variables de entorno**:
   - Revisa `src/environments/environment.ts` para desarrollo
   - Revisa `src/environments/environment.prod.ts` para producción
   - Configura `src/environments/stripe.environment.ts` con tus claves de Stripe

## Configuración

### Variables de Entorno

#### Desarrollo (`src/environments/environment.ts`)
```typescript
export const environment = {
  production: false,
  apiUrl: '/api'
};
```

#### Producción (`src/environments/environment.prod.ts`)
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://tu-api.com/api'
};
```


### Proxy Configuration

El archivo `proxy.conf.json` está configurado para redirigir las peticiones al backend durante el desarrollo:

```json
{
  "/api/*": {
    "target": "http://localhost:3000",
    "secure": false,
    "changeOrigin": true,
    "logLevel": "debug"
  }
}
```

Para usar el proxy, ejecuta:
```bash
ng serve --proxy-config proxy.conf.json
```

### Puerto por Defecto

- **Puerto de desarrollo**: 4200
- **API Backend**: http://localhost:3000/api

## Estructura del Proyecto

```
src/
├── app/
│   ├── components/              # Componentes de la aplicación
│   │   ├── confirm-reservation/ # Confirmación de reserva
│   │   ├── customers/           # Gestión de clientes
│   │   ├── dashboard/           # Dashboard principal
│   │   ├── employees/           # Gestión de empleados
│   │   ├── landing/             # Página de inicio pública
│   │   │   ├── footer/          # Pie de página
│   │   │   ├── navbar/          # Barra de navegación
│   │   │   ├── pick-room/       # Selección de habitación
│   │   │   ├── pick-services/   # Selección de servicios
│   │   │   ├── search-room/     # Búsqueda de habitaciones
│   │   │   └── seleccion-habitacion/ # Selección de habitación (alternativa)
│   │   ├── login/               # Página de inicio de sesión
│   │   ├── payment-success/     # Página de éxito de pago
│   │   ├── reservations/         # Gestión de reservas
│   │   ├── rooms/               # Gestión de habitaciones
│   │   ├── service-process/     # Proceso de servicio
│   │   │   └── available-rooms/ # Habitaciones disponibles
│   │   └── services/            # Gestión de servicios
│   ├── guards/                  # Guards de protección de rutas
│   │   └── auth.guard.ts        # Guard de autenticación
│   ├── models/                  # Interfaces y tipos TypeScript
│   │   ├── customer.model.ts
│   │   ├── employee.model.ts
│   │   ├── pet.model.ts
│   │   ├── reservation.model.ts
│   │   ├── room.model.ts
│   │   ├── service.model.ts
│   │   └── index.ts
│   ├── services/                # Servicios para comunicación con API
│   │   ├── auth.interceptor.ts  # Interceptor HTTP para tokens
│   │   ├── auth.service.ts      # Servicio de autenticación
│   │   ├── customer.service.ts
│   │   ├── dashboard.service.ts
│   │   ├── employee.service.ts
│   │   ├── reservation.service.ts
│   │   ├── room.service.ts
│   │   ├── service.service.ts
│   │   └── stripe.service.ts    # Servicio de integración con Stripe
│   ├── app.component.*          # Componente raíz
│   └── app.routes.ts            # Configuración de rutas
├── environments/                # Variables de entorno
│   ├── environment.ts
│   ├── environment.prod.ts
│   └── stripe.environment.ts
├── styles.scss                  # Estilos globales
├── index.html                   # Página principal
└── main.ts                      # Punto de entrada
```

## Rutas y Navegación

### Rutas Públicas

- `/` - Página de inicio (Landing)
- `/seleccion-habitacion` - Selección de habitación
- `/login` - Inicio de sesión
- `/process` - Proceso de servicio
- `/confirm-reservation` - Confirmación de reserva
- `/payment-success` - Página de éxito de pago

### Rutas Protegidas (requieren autenticación)

- `/dashboard` - Dashboard principal
- `/customers` - Gestión de clientes
- `/employees` - Gestión de empleados
- `/rooms` - Gestión de habitaciones
- `/services` - Gestión de servicios
- `/reservations` - Gestión de reservas

Todas las rutas protegidas utilizan el `authGuard` que redirige a `/login` si el usuario no está autenticado.

## Autenticación

El sistema utiliza autenticación basada en JWT (JSON Web Tokens).

### Flujo de Autenticación

1. **Login**: El usuario ingresa credenciales en `/login`
2. **Token Storage**: El token JWT se almacena en `localStorage`
3. **Interceptor**: El `auth.interceptor.ts` añade automáticamente el token a todas las peticiones HTTP
4. **Guards**: Las rutas protegidas verifican la autenticación antes de permitir el acceso
5. **Logout**: El token se elimina de `localStorage`

### Servicio de Autenticación

El `AuthService` proporciona los siguientes métodos:

- `login(credentials)` - Iniciar sesión
- `register(userData)` - Registrar nuevo usuario
- `logout()` - Cerrar sesión
- `isAuthenticated()` - Verificar si el usuario está autenticado
- `getToken()` - Obtener el token actual
- `getCurrentUser()` - Obtener información del usuario actual
- `getEmailFromToken()` - Extraer email del token JWT

## Componentes Principales

### Dashboard
- Estadísticas generales del hotel
- Reservas recientes
- Métricas de ocupación
- Vista rápida de información clave

### Gestión de Clientes
- CRUD completo de clientes
- Formularios con validación
- Búsqueda y filtrado
- Gestión de información de mascotas

### Gestión de Empleados
- Administración de personal
- Control de salarios y posiciones
- Estado activo/inactivo
- Asignación de roles

### Gestión de Habitaciones
- Tipos de habitaciones
- Control de disponibilidad
- Precios y capacidades
- Estado de habitaciones

### Gestión de Servicios
- Servicios adicionales
- Precios y duración
- Estado activo/inactivo
- Categorización de servicios

### Gestión de Reservas
- Creación de reservas
- Estados de reserva (pendiente, confirmada, completada, cancelada)
- Asignación de habitaciones
- Integración con pagos

### Landing Page
- Búsqueda de habitaciones disponibles
- Selección de servicios
- Proceso de reserva público
- Información del hotel

## Servicios

### Servicios de API

- **AuthService**: Autenticación y autorización
- **CustomerService**: Gestión de clientes
- **EmployeeService**: Gestión de empleados
- **RoomService**: Gestión de habitaciones
- **ServiceService**: Gestión de servicios
- **ReservationService**: Gestión de reservas
- **DashboardService**: Datos del dashboard
- **StripeService**: Integración con Stripe para pagos

### Interceptores

- **AuthInterceptor**: Añade automáticamente el token JWT a todas las peticiones HTTP

## Scripts Disponibles

### Desarrollo

```bash
# Iniciar servidor de desarrollo
npm start
# o
ng serve

# Iniciar con puerto específico
npm run serve
# o
ng serve --port 4200

# Iniciar con proxy configurado
ng serve --proxy-config proxy.conf.json

# Construir en modo desarrollo
npm run build
# o
ng build

# Construir en modo watch (desarrollo)
npm run watch
```

### Producción

```bash
# Construir para producción
npm run build:prod
# o
ng build --configuration production
```

### Testing

```bash
# Ejecutar pruebas unitarias
npm test
# o
ng test
```

## Desarrollo

### Iniciar el Servidor de Desarrollo

```bash
npm start
```

La aplicación estará disponible en `http://localhost:4200`

### Estructura de Componentes

Los componentes utilizan la arquitectura standalone de Angular 17:

```typescript
@Component({
  selector: 'app-example',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.scss']
})
export class ExampleComponent {
  // ...
}
```

### Estilos

- Los estilos globales se encuentran en `src/styles.scss`
- Cada componente tiene su propio archivo `.scss`
- Se utiliza SCSS para variables, mixins y funciones reutilizables

### Modelos de Datos

Los modelos TypeScript están definidos en `src/app/models/`:

- `Customer` - Información de clientes
- `Employee` - Información de empleados
- `Pet` - Información de mascotas
- `Reservation` - Información de reservas
- `Room` - Información de habitaciones
- `Service` - Información de servicios

## Despliegue

### Construcción para Producción

```bash
npm run build:prod
```

Los archivos compilados se generarán en `dist/frontend/`

### Configuración de Producción

Antes de desplegar:

1. Actualiza `src/environments/environment.prod.ts` con la URL de tu API de producción
2. Configura `src/environments/stripe.environment.ts` con tus claves de Stripe de producción
3. Revisa la configuración de CORS en el backend

### Despliegue en Servidores Estáticos

Los archivos en `dist/frontend/` pueden ser servidos por:

- **Nginx**
- **Apache**
- **Netlify**
- **Vercel**
- **GitHub Pages**
- **AWS S3 + CloudFront**


## Tecnologías Utilizadas

### Core
- **Angular 17** - Framework principal
- **TypeScript 5.2** - Lenguaje de programación
- **RxJS 7.8** - Programación reactiva

### Estilos
- **SCSS** - Preprocesador CSS

### Herramientas de Desarrollo
- **Angular CLI 17** - Herramientas de línea de comandos
- **Karma** - Test runner
- **Jasmine** - Framework de testing

### Integraciones
- **Stripe** - Procesamiento de pagos
- **JWT** - Autenticación


## Notas

- El proyecto utiliza lazy loading para optimizar el rendimiento
- Todas las rutas protegidas requieren autenticación
- El token JWT se almacena en `localStorage`
- El proxy solo funciona en modo desarrollo

## Contribución

Para contribuir al proyecto:

1. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
2. Realiza tus cambios
3. Commit tus cambios (`git commit -m 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request


**Desarrollado con Angular 17**
