import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  constructor(
    private http: HttpClient
  ) { }

  getRecentBooks() {
    //not implemented
  }

  searchBooks(searchString: string, page: number, size: number) {
    return this.http.get(`${environment.apiBaseUrl}/book?search=${searchString}&page=${page}&size=${size}`);
  }
}