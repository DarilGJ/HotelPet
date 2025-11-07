# Guía de Despliegue en Render

Esta guía te ayudará a desplegar tu aplicación Angular en Render.

## Archivos Creados

1. **server.js** - Servidor Express para servir los archivos estáticos de Angular
2. **render.yaml** - Archivo de configuración para Render
3. **package.json** - Actualizado con scripts de producción y dependencia de Express

## Configuración Previa

### 1. Actualizar la URL de la API en producción

Edita el archivo `src/environments/environment.prod.ts` y actualiza la URL de tu API backend:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://tu-backend-en-render.onrender.com/api' // Cambia esta URL
};
```

### 2. Instalar dependencias localmente (opcional, para probar)

```bash
npm install
```

## Despliegue en Render

### Opción 1: Usando render.yaml (Recomendado)

1. **Sube tu código a GitHub/GitLab/Bitbucket**
   - Asegúrate de que todos los archivos estén commitados y pusheados

2. **Conecta tu repositorio en Render**
   - Ve a [render.com](https://render.com)
   - Inicia sesión o crea una cuenta
   - Haz clic en "New +" y selecciona "Blueprint"
   - Conecta tu repositorio

3. **Render detectará automáticamente el render.yaml**
   - Render usará la configuración del archivo `render.yaml`
   - No necesitas configurar nada manualmente

### Opción 2: Configuración Manual

Si prefieres configurar manualmente:

1. **Crea un nuevo Web Service en Render**
   - Ve a [render.com](https://render.com)
   - Haz clic en "New +" y selecciona "Web Service"
   - Conecta tu repositorio de Git

2. **Configura el servicio:**
   - **Name**: frontend (o el nombre que prefieras)
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build:prod`
   - **Start Command**: `npm run start:prod`
   - **Instance Type**: Free (o el plan que prefieras)

3. **Variables de Entorno**:
   - `NODE_ENV`: production
   - `PORT`: Render asigna automáticamente el puerto

4. **Haz clic en "Create Web Service"**

## Configuración del Backend

Si tu backend también está en Render:

1. Despliega tu backend en Render primero
2. Obtén la URL de tu backend (ej: `https://tu-backend.onrender.com`)
3. Actualiza `src/environments/environment.prod.ts` con la URL del backend
4. Hacer commit y push de los cambios
5. Render reconstruirá automáticamente tu frontend

## Variables de Entorno en Render

Si necesitas configurar variables de entorno (como claves de API):

1. Ve a tu servicio en el dashboard de Render
2. Ve a la sección "Environment"
3. Agrega las variables que necesites
4. Si usas variables en tu código Angular, asegúrate de configurarlas antes del build

## Comandos Disponibles

- `npm run build:prod` - Construye la aplicación para producción
- `npm run start:prod` - Inicia el servidor Express para servir la aplicación
- `npm run build` - Build de desarrollo
- `npm start` - Servidor de desarrollo de Angular

## Notas Importantes

1. **Puerto**: Render asigna automáticamente el puerto a través de la variable de entorno `PORT`. El servidor está configurado para usar esta variable.

2. **SPA Routing**: El servidor está configurado para manejar las rutas de Angular (todas las rutas redirigen a `index.html`).

3. **Build Time**: El primer despliegue puede tomar varios minutos mientras Render instala las dependencias y construye la aplicación.

4. **Auto-Deploy**: Render despliega automáticamente cuando haces push a la rama principal de tu repositorio.

## Solución de Problemas

### Error: "Cannot find module 'express'"
- Asegúrate de que `express` esté en las `dependencies` de `package.json` (no en `devDependencies`)

### Error: "Cannot GET /ruta"
- Verifica que el servidor esté configurado para servir `index.html` en todas las rutas (ya está configurado en `server.js`)

### Error de CORS
- Si tienes problemas de CORS con tu backend, configura los headers apropiados en tu backend o usa un proxy

### Build falla
- Verifica que todas las dependencias estén correctamente instaladas
- Revisa los logs de build en Render para más detalles

## Prueba Local

Para probar localmente el servidor de producción:

```bash
# 1. Construir la aplicación
npm run build:prod

# 2. Iniciar el servidor
npm run start:prod
```

La aplicación estará disponible en `http://localhost:3000`

