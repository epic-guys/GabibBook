import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { LocalStorageService } from '../services/storage/local-storage.service';
import { AuthService } from '../services/auth/auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(
    public localStorageService: LocalStorageService,
    public authService: AuthService
  ) { }

  excludedUrls = [
    'login',
    'register',
    'forgot-password',
  ];

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!(
      this.excludedUrls.some(url => request.url.includes(url))
    )) {
      const auth = this.localStorageService.getAuth();
      const token = auth ? auth.accessToken.jwt : null;

      if (token) {
        request = request.clone({
          setHeaders: {
            'Content-Type': 'application/json; charset=utf-8',
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
          }
        });
      } else {
        request = request.clone({
          setHeaders: {
            'Content-Type': 'application/json; charset=utf-8',
            Accept: 'application/json'
          }
        });
      }
    }

    return next.handle(
      request
    ).pipe(
      catchError((error) => {
        if (error.status === 401 && this.authService.isAuthenticated()) {
          console.error('Token expired');
          this.authService.logout();
        }
        return throwError(() => new Error(error.message));
      })
    );
  }
}
