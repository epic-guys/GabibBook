import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {LocalStorageService} from '../storage/local-storage.service';
import {environment} from '../../../../environments/environment';
import {HttpClient} from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

  constructor(
      private localStorageService: LocalStorageService,
      private router: Router,
      public httpClient: HttpClient,
  ) {
  }

  login(data: { username: string, password: string }) {
    return this.httpClient.get(environment.apiBaseUrl + '/auth/login', {
        headers: {
          'Authorization': 'Basic ' + btoa(data.username + ':' + data.password)
        }
      }
    );
  }

  register(data: { username: string, password: string }) {
    return this.httpClient.post(environment.apiBaseUrl + '/auth/register', data);
  }

  isAuthenticated() {
      const auth = this.localStorageService.getAuth();
      const now = new Date().getTime();

      if (!auth || now > auth.expirationTimestamp) {
          //this.logout();
          return false;
      }
      return true;
  }

  logout() {
      this.localStorageService.removeAuth();
      this.router.navigate(['/']); 
  }

  requestPasswordReset(data: { email: string }) {
    return this.httpClient.post(environment.apiBaseUrl + '/auth/request-reset-password', data);
  }

  confirmPasswordReset(token: string, data: { password: string }) {
    return this.httpClient.post(environment.apiBaseUrl + '/auth/reset-password', data, {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });
  }
}