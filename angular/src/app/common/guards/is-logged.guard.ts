import { inject } from '@angular/core';
import { CanActivateFn, CanActivateChildFn, Router} from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

export const isLoggedGuard: CanActivateFn = (route, state) => {
  
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const canActivate = authService.isAuthenticated();
  if (!canActivate) {
    router.navigate(['/login']);
  }
  
  return canActivate;
};

export const isLoggedChildGuard: CanActivateChildFn = (route, state) => {
  return isLoggedGuard(route, state);
};