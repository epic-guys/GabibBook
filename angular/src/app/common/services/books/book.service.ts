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

  searchBooks(searchString: string, page: number = 0, size: number = 10) {
    return this.http.get(`${environment.apiBaseUrl}/books`, {params: 
      {
        search: searchString, 
        page: page.toString(), 
        size: size.toString()
      }
    });
  }

  getBook(id: string) {
    return this.http.get(`${environment.apiBaseUrl}/books/${id}`);
  }

  deleteBook(id: string) {
    return this.http.delete(`${environment.apiBaseUrl}/books/${id}`);
  }

  bid(bookId: string, price: number) {
    return this.http.post(`${environment.apiBaseUrl}/books/${bookId}/offer`, {value: price});
  }

  getChat(bookId: string, buyerId: string | null = null) {
    return this.http.get(`${environment.apiBaseUrl}/books/${bookId}/chats`, {params: buyerId ? {buyerId: buyerId} : {}});
  }
}