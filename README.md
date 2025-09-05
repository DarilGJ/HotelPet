# Pet Hotel Management - Frontend

Este es el frontend de la aplicación de gestión de hotel para mascotas, desarrollado con Angular 17.

## Características

- **Angular 17** con arquitectura standalone components
- **TypeScript** para tipado estático
- **SCSS** para estilos
- **Responsive Design** para dispositivos móviles y desktop
- **Componentes modulares** para cada entidad del sistema

## Estructura del Proyecto

```
src/
├── app/
│   ├── components/          # Componentes de la aplicación
│   │   ├── dashboard/       # Dashboard principal
│   │   ├── customers/       # Gestión de clientes
│   │   ├── employees/       # Gestión de empleados
│   │   ├── rooms/          # Gestión de habitaciones
│   │   ├── services/       # Gestión de servicios
│   │   └── reservations/   # Gestión de reservas
│   ├── models/             # Interfaces y tipos TypeScript
│   ├── services/           # Servicios para comunicación con API
│   ├── app.component.*     # Componente raíz
│   └── app.routes.ts       # Configuración de rutas
├── styles.scss             # Estilos globales
└── index.html              # Página principal
```

## Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Ejecutar en modo desarrollo:
```bash
npm start
```

3. Construir para producción:
```bash
npm run build:prod
```

## Configuración

- **Puerto**: 4200 (por defecto)
- **API Backend**: http://localhost:3000/api
- **Modo desarrollo**: `ng serve --port 4200`

## Componentes Principales

### Dashboard
- Estadísticas generales del hotel
- Reservas recientes
- Métricas de ocupación

### Gestión de Clientes
- CRUD completo de clientes
- Formularios de validación
- Búsqueda y filtrado

### Gestión de Empleados
- Administración de personal
- Control de salarios y posiciones
- Estado activo/inactivo

### Gestión de Habitaciones
- Tipos de habitaciones
- Control de disponibilidad
- Precios y capacidades

### Gestión de Servicios
- Servicios adicionales
- Precios y duración
- Estado activo/inactivo

### Gestión de Reservas
- Creación de reservas
- Estados de reserva
- Asignación de habitaciones

## Tecnologías Utilizadas

- Angular 17
- TypeScript
- SCSS
- RxJS
- Angular Router
- Angular HTTP Client

## Scripts Disponibles

- `npm start` - Servidor de desarrollo
- `npm run build` - Construcción para desarrollo
- `npm run build:prod` - Construcción para producción
- `npm test` - Ejecutar pruebas
- `npm run serve` - Servidor con puerto específico
