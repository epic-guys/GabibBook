import { inject } from '@angular/core';
import { CanActivateFn, CanActivateChildFn, Router} from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

export const isNotLoggedGuard: CanActivateFn = (route, state) => {
  
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const canActivate = authService.isAuthenticated();
  if (canActivate) {
    router.navigate(['/']);
  }
  return canActivate;
};

export const isNotLoggedChildGuard: CanActivateChildFn = (route, state) => {
  return isNotLoggedGuard(route, state);
};