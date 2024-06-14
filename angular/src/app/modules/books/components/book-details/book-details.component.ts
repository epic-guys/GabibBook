import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Book } from 'src/app/common/models/book';
import { BookService } from 'src/app/common/services/books/book.service';
import { AuthService } from 'src/app/common/services/auth/auth.service';

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.scss']
})
export class BookDetailsComponent {
  ajaxLoading = true;
  isLoggedIn = false;
  ends_in = 0;
  book: Book | null = null;
  constructor(public bookService: BookService, public acRoute: ActivatedRoute, public auth: AuthService) {
    this.isLoggedIn = this.auth.isAuthenticated();
  }

  ngOnInit(): void {
    const observer = {
      next: (book: any) => {
        this.book = book;
        console.log(book);
        this.updateEndsInEverySecond();
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

  endsInCalc() {
    if (!this.book) {
      this.ends_in = 0;
      return;
    }
    const unixNow = Math.floor(Date.now() / 1000);
    const unixEnd = Math.floor(Date.parse(this.book!.close_date) / 1000);

    this.ends_in = unixEnd - unixNow;
  }

  updateEndsInEverySecond() {
    setInterval(() => {
      this.endsInCalc();
    }, 1000);
  }
}