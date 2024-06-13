import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Book } from 'src/app/common/models/book';
import { BookService } from 'src/app/common/services/books/book.service';

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.scss']
})
export class BookDetailsComponent {
  ajaxLoading = true;
  book: Book | null = null;
  constructor(public bookService: BookService, public acRoute: ActivatedRoute) { }

  ngOnInit(): void {
    const observer = {
      next: (book: any) => {
        this.book = book;
      },
      error: (error: any) => {
        console.error(error);
      },
      complete: () => {
        this.ajaxLoading = false;
      }
    };

    const id = this.acRoute.snapshot.paramMap.get('uuid');
    this.bookService.getBook(id!).subscribe(observer);
  }
}