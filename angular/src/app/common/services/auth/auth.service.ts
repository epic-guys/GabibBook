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
    return this.httpClient.post(environment.apiBaseUrl + '/token/generate', data);
  }

  isAuthenticated() {
      const auth = this.localStorageService.getAuth();
      const now = new Date().getTime();

      if (!auth || now > auth.expirationTimestamp) {
          this.logout();
          return false;
      }
      return true;
  }

  public canRefresh() {
      const auth = this.localStorageService.getAuth();
      return auth && auth.refreshToken;
  }

  refreshToken(token: string) {
    return this.httpClient.post(environment.apiBaseUrl + '/token/refresh', {
      refresh_token: token
    }, {});
  }

  logout() {
      this.localStorageService.removeAuth();
      //this.router.navigate(['/login']); 
      //TODO: Redirect to login page, not implemented since there is no login system
  }

}