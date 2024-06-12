import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BookService } from 'src/app/common/services/books/book.service';

import { Book } from '../../../../common/models/book';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent {

  ajaxLoading = false;

  constructor(private router: Router,
    private bookService: BookService
  ) { }   

  books: Book[] = [];

  ngOnInit() {
    this.ajaxLoading = true;
    const observer = {
      next: (res: any) => {
        this.ajaxLoading = false;
        this.books = res.data;
      },
      error: (error: any) => {
        this.ajaxLoading = false;
        console.error(error);
      },
      complete: () => {
        this.ajaxLoading = false;
      }
    }

    this.bookService.getRecentBooks().subscribe(observer);
  }

  onSearchButtonPressed(string: String): void {
    this.router.navigate(['/books'], { queryParams: { search: string } });
  }
}