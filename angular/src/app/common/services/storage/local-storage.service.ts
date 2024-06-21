import {Inject, Injectable} from '@angular/core';
import {LOCAL_STORAGE, StorageService} from 'ngx-webstorage-service';

const ROLE_VIEWER = 'viewer';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private STORAGE_KEYS = {
    auth: 'auth'
  };
  private KEY_AUTH = 'gabibbook.auth';

  constructor(
    @Inject(LOCAL_STORAGE) private localStorage: StorageService
  ) {}

  public getAuth() {
    return this.localStorage.get(this.KEY_AUTH) || null;
  }

  public removeAuth() {
    this.localStorage.remove(this.KEY_AUTH);
  }

  getAuthInfo() {
    let authInfo = this.localStorage.get(this.KEY_AUTH);
    authInfo = this.decodeToken(authInfo.accessToken.jwt);
    return authInfo || null;
  }

  setAuth(auth: any) {
    this.localStorage.set(this.KEY_AUTH, auth);
  }

  decodeToken(token: string) {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  getRole() {
    const auth = this.getAuth();
    if (auth) {
      return this.decodeToken(auth.accessToken.jwt).role;
    }
    return null;
  }

  getUserName() {
    const auth = this.getAuth();
    if (auth) {
      return this.decodeToken(auth.accessToken.jwt).nickname;
    }
    return null;
  }

  getUserId() {
    const auth = this.getAuth();
    if (auth) {
      return this.decodeToken(auth.accessToken.jwt)._id;
    }
    return null;
  }
}

