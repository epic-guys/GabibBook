import { Component } from '@angular/core';
import { Book } from 'src/app/common/classes/book';

@Component({
  selector: 'app-bookspage',
  templateUrl: './bookspage.component.html',
  styleUrls: ['./bookspage.component.scss']
})
export class BookspageComponent {

  searchInput: String = '';
  currentPage: number = 1;
  totalPages: number = 1;

  books: Book[] = [
    {
      uuid: "1",
      title: "The Hobbit",
      isbn: "9780547928227",
      author: "J.R.R. Tolkien",
      price: "9.99",
      cover: "https://via.placeholder.com/250x350"
    },
  ];

  constructor() {
    const urlParams = new URLSearchParams(window.location.search);
    this.searchInput = urlParams.get('search') || '';
  }

  onSearchButtonPressed(event: String): void {
    window.history.pushState({}, '', `?search=${event}`);
    //TODO: make the actual search
  }

  onPageChange(page: Event): void {
    //TODO: TEST THIS, IT MIGHT NOT WORK 
    const tmp = (page.target as HTMLButtonElement).value;
    this.currentPage = parseInt(tmp);
    //TODO: make the actual search
  }

}