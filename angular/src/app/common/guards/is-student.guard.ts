import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LocalStorageService } from '../services/storage/local-storage.service';

export const isAdminGuard: CanActivateFn = (route, state) => {
  const authService = inject(LocalStorageService);
  const router = inject(Router);
  
  const canActivate = authService.getRole() === 'student';
  if (!canActivate) {
    router.navigate(['/profile']);
  }
  
  return canActivate;
};
