const express = require('express');
const path = require('path');
const app = express();

// Servir archivos estáticos desde la carpeta dist/frontend
// Es importante servir los archivos estáticos antes de las rutas dinámicas
app.use(express.static(path.join(__dirname, 'dist/frontend'), {
  maxAge: '1y',
  etag: false,
  setHeaders: (res, filePath) => {
    // Configurar headers apropiados para diferentes tipos de archivos
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    } else if (filePath.match(/\.(js|css|woff|woff2|ttf|eot|svg|png|jpg|jpeg|gif|ico)$/)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
  }
}));

// Para todas las rutas que no sean archivos estáticos, servir index.html (necesario para Angular Router)
app.get('*', (req, res, next) => {
  // Si la petición es para un archivo estático, continuar
  if (req.path.match(/\.(js|css|woff|woff2|ttf|eot|svg|png|jpg|jpeg|gif|ico|json)$/)) {
    return next();
  }
  // Para todas las demás rutas, servir index.html
  res.sendFile(path.join(__dirname, 'dist/frontend/index.html'), (err) => {
    if (err) {
      res.status(500).send(err);
    }
  });
});

// Puerto proporcionado por Render o 3000 por defecto
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
  console.log(`Sirviendo archivos desde: ${path.join(__dirname, 'dist/frontend')}`);
});

