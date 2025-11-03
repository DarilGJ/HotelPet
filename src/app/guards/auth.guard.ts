import { CanMatchFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authGuard: CanMatchFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (authService.isAuthenticated()) {
    return true;
  }
  
  const currentUrl = router.url;
  
  // Si ya estamos en login, no hacer nada
  if (currentUrl.includes('/login')) {
    router.navigate(['/login']);
    return false;
  }
  
  // Guardar la URL de retorno con queryParams si existen
  const urlTree = router.parseUrl(currentUrl);
  const queryParams = urlTree.queryParams;
  
  // Pasar la URL completa como queryParam para redirigir después del login
  router.navigate(['/login'], {
    queryParams: { returnUrl: currentUrl, ...queryParams }
  });
  
  return false;
};


