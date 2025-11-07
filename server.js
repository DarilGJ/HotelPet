const express = require('express');
const path = require('path');
const app = express();

// Servir archivos estáticos desde la carpeta dist/frontend
app.use(express.static(path.join(__dirname, 'dist/frontend')));

// Para todas las rutas, servir index.html (necesario para Angular Router)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/frontend/index.html'));
});

// Puerto proporcionado por Render o 3000 por defecto
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

