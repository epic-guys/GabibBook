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
    return this.http.get(`${environment.apiBaseUrl}/books?last=${environment.LASTBOOKS}`);
  }

  searchBooks(searchString: string, page: number, size: number) {
    return this.http.get(`${environment.apiBaseUrl}/books?search=${searchString}&page=${page}&size=${size}`);
  }
}