const fs = require('fs');
const path = require('path');

console.log('Verificando configuración del build...\n');

// Verificar que existe dist/frontend
const distPath = path.join(__dirname, 'dist', 'frontend');
const indexPath = path.join(distPath, 'index.html');

let errors = [];
let warnings = [];
let success = [];

// 1. Verificar que existe la carpeta dist/frontend
if (fs.existsSync(distPath)) {
  success.push('Carpeta dist/frontend existe');
} else {
  errors.push('Carpeta dist/frontend no existe. Ejecuta: npm run build:prod');
}

// 2. Verificar que existe index.html
if (fs.existsSync(indexPath)) {
  success.push('index.html existe en dist/frontend');
  
  // Leer el contenido del index.html
  const indexContent = fs.readFileSync(indexPath, 'utf8');
  
  // 3. Verificar que el base href esté configurado correctamente
  if (indexContent.includes('<base href="/">')) {
    success.push('base href está configurado como "/" (absoluto)');
  } else if (indexContent.includes('<base href="./">')) {
    errors.push('base href está configurado como "./" (relativo). Debe ser "/"');
  } else {
    warnings.push('No se encontró base href en index.html');
  }
  
  // 4. Verificar que los archivos CSS se referencien correctamente
  const cssMatches = indexContent.match(/<link[^>]*href="([^"]*\.css[^"]*)"[^>]*>/g);
  if (cssMatches && cssMatches.length > 0) {
    success.push(`Se encontraron ${cssMatches.length} referencia(s) a archivos CSS`);
    
    // Verificar que los archivos CSS existan
    cssMatches.forEach(match => {
      const hrefMatch = match.match(/href="([^"]+)"/);
      if (hrefMatch) {
        const cssPath = hrefMatch[1];
        // Remover query strings y hash
        const cleanPath = cssPath.split('?')[0].split('#')[0];
        const fullPath = path.join(distPath, cleanPath);
        
        if (fs.existsSync(fullPath)) {
          success.push(`  CSS encontrado: ${cleanPath}`);
        } else {
          errors.push(`  CSS no encontrado: ${cleanPath}`);
        }
      }
    });
  } else {
    warnings.push('No se encontraron referencias a archivos CSS en index.html');
  }
  
  // 5. Verificar que los archivos JS se referencien correctamente
  const jsMatches = indexContent.match(/<script[^>]*src="([^"]*\.js[^"]*)"[^>]*>/g);
  if (jsMatches && jsMatches.length > 0) {
    success.push(`Se encontraron ${jsMatches.length} referencia(s) a archivos JS`);
    
    jsMatches.forEach(match => {
      const srcMatch = match.match(/src="([^"]+)"/);
      if (srcMatch) {
        const jsPath = srcMatch[1];
        const cleanPath = jsPath.split('?')[0].split('#')[0];
        const fullPath = path.join(distPath, cleanPath);
        
        if (fs.existsSync(fullPath)) {
          success.push(`  JS encontrado: ${cleanPath}`);
        } else {
          errors.push(`  JS no encontrado: ${cleanPath}`);
        }
      }
    });
  } else {
    warnings.push('No se encontraron referencias a archivos JS en index.html');
  }
} else {
  errors.push('index.html no existe en dist/frontend');
}

// 6. Verificar que los assets existan
const assetsPath = path.join(distPath, 'assets');
if (fs.existsSync(assetsPath)) {
  success.push('Carpeta assets existe');
  const assetsFiles = fs.readdirSync(assetsPath);
  if (assetsFiles.length > 0) {
    success.push(`Se encontraron ${assetsFiles.length} archivo(s) en assets`);
  }
} else {
  warnings.push('Carpeta assets no existe (puede estar vacía)');
}

// 7. Verificar que favicon.ico exista
const faviconPath = path.join(distPath, 'favicon.ico');
if (fs.existsSync(faviconPath)) {
  success.push('favicon.ico existe');
} else {
  warnings.push('favicon.ico no encontrado');
}

// 8. Verificar que los archivos tengan hash (para cache busting)
const files = fs.readdirSync(distPath);
const hashedFiles = files.filter(file => /-[a-f0-9]{16,}\.(js|css)$/.test(file));
if (hashedFiles.length > 0) {
  success.push(`Se encontraron ${hashedFiles.length} archivo(s) con hash (cache busting activado)`);
} else {
  warnings.push('No se encontraron archivos con hash. Verifica que outputHashing esté configurado como "all"');
}

// Mostrar resultados
console.log('\nRESULTADOS:\n');
console.log('Éxitos:');
success.forEach(msg => console.log(`  ${msg}`));

if (warnings.length > 0) {
  console.log('\n Advertencias:');
  warnings.forEach(msg => console.log(`  ${msg}`));
}

if (errors.length > 0) {
  console.log('\n Errores:');
  errors.forEach(msg => console.log(`  ${msg}`));
  console.log('\n Solución: Ejecuta "npm run build:prod" para generar el build de producción');
  process.exit(1);
} else {
  console.log('\n ¡Todo se ve bien! Los archivos están configurados correctamente.');
  console.log('\n Próximos pasos:');
  console.log('  1. Verifica que el servidor Express pueda servir los archivos');
  console.log('  2. Prueba localmente con: npm run start:prod');
  console.log('  3. Verifica que los estilos se carguen correctamente en el navegador');
}

