import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StatService {

  constructor(private http: HttpClient) { }

  getStats(result: string, count: boolean = true){
    ///stats/auctions?result=(successful | unsuccessful)&?count=true
    return this.http.get(environment.apiBaseUrl + '/stats/auctions', { params: { result: result, count: count.toString() } });
  }
}
