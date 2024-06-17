import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InviteService {

  constructor(private http: HttpClient) { }

  getInvites(){
    return this.http.get(environment.apiBaseUrl + '/invites');
  }

  createInvite(data: any){
    return this.http.post( environment.apiBaseUrl + '/invites', data);
  }

  deleteInvite(id: string){
    return this.http.delete(environment.apiBaseUrl + `/invites/${id}`);
  }
}
