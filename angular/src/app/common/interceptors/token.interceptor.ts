import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { LocalStorageService } from '../services/storage/local-storage.service';
import { AuthService } from '../services/auth/auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(
    public localStorageService: LocalStorageService,
    public authService: AuthService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const auth = this.localStorageService.getAuth();

    const url = request.url;
    let headers;

    if (!(url.includes('login') || (url.includes('users') && request.method === 'POST'))) {
      if (auth) {          
        headers = {Authorization: `Bearer ${auth.accessToken.jwt}`};
      }
    }

    return next.handle(
      request.clone({
        setHeaders: {
          ...headers
        }
      })).pipe(
        catchError((error) => {
          if (error.status === 401 && auth && url !== 'login' && (!url.includes('users') || request.method !== 'POST')){
            this.localStorageService.removeAuth();
            this.authService.logout();
          }
          throw error;
        }
      )
      );
  }
}
