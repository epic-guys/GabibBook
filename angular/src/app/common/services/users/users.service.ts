import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) { }

  public getUserInfo(uid: String){
    return this.http.get(`${environment.apiBaseUrl}/users/${uid}`);  
  }

  public getUsers(filter: string = ''){
    return this.http.get(`${environment.apiBaseUrl}/users`, {params: filter? {filter: filter} : {}});
  }

  public banUser(uid: String){
    return this.http.delete(`${environment.apiBaseUrl}/users/${uid}`, {});
  }
}
