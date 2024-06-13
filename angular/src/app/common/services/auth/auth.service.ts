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

}