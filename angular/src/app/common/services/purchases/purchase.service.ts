import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {

  constructor(private http: HttpClient) { }

  getPurchasesAsBuyer(id: string){
    return this.http.get(environment.apiBaseUrl + '/purchases', {params: {buyer_id: id}});
  }

  getPurchasesAsSeller(id: string){
    return this.http.get(environment.apiBaseUrl + '/purchases', {params: {seller_id: id}});
  }

  //TODO: put for statuses
}
