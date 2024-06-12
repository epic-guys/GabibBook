import { Component } from '@angular/core';
import { Book } from 'src/app/common/models/book';
import { BookService } from 'src/app/common/services/books/book.service';

@Component({
  selector: 'app-bookspage',
  templateUrl: './bookspage.component.html',
  styleUrls: ['./bookspage.component.scss']
})
export class BookspageComponent {

  ajaxLoading: boolean = false;
  searchInput: string = '';
  currentPage: number = 1;
  totalPages: number = 1;

  books: Book[] = [];

  constructor(
    private booksService: BookService,
  ) {
    const urlParams = new URLSearchParams(window.location.search);
    this.searchInput = urlParams.get('search') || '';
  }

  ngOnInit(){
    this.triggerSearch();
  }

  onSearchButtonPressed(event: String): void {
    window.history.pushState({}, '', `?search=${event}`);
    this.searchInput = String(event);
    this.triggerSearch();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.triggerSearch();
  }

  triggerSearch(): void {
    this.ajaxLoading = true;

    const observer = {
      next: (res: any) => {
        this.ajaxLoading = false;
        this.books = res.data;
        this.totalPages = res.totalPages;
      },
      error: (error: any) => {
        this.ajaxLoading = false;
        console.error(error);
      },
      complete: () => {
        this.ajaxLoading = false;
      }
    }

    this.booksService.searchBooks(this.searchInput, this.currentPage, 1).subscribe(observer);
  }

}