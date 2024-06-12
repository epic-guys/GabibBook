import { Injectable } from '@angular/core';
import { Book } from '../../models/book';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BookUtilsServiceService {

  constructor(
    private http: HttpClient
  ) { }
}
