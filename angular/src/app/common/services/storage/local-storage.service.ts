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


  removeAuth() {
    this.localStorage.remove(this.KEY_AUTH);
  }

  getAuthInfo() {
    const authInfo = this.localStorage.get(this.STORAGE_KEYS.auth);
    return authInfo || null;
  }

  setAuth(auth: any) {
    this.localStorage.set(this.KEY_AUTH, auth);
  }

  getRole() {
    const auth = this.getAuth();
    return auth ? auth.role : ROLE_VIEWER;
  }
}

