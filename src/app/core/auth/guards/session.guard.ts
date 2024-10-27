import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const sessionGuard: CanActivateFn = (route, state) => {
  const router = inject(Router)
  const authService = inject(AuthService)

  if(authService.isAuthenticated()){
    router.navigate(['/app/agenda/resumen'])
    return false
  }
  
  return true;
};
