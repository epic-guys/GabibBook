import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Book } from '../../../../common/classes/book';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent {

  constructor(private router: Router) { }

  books: Book[] = [
    {
      uuid: "1",
      title: "The Hobbit",
      isbn: "9780547928227",
      author: "J.R.R. Tolkien",
      price: "9.99",
      cover: "https://via.placeholder.com/250x350"
    },
    {
      uuid: "2",
      title: "The Fellowship of the Ring",
      isbn: "9780547928210",
      author: "J.R.R. Tolkien",
      price: "9.99",
      cover: "https://via.placeholder.com/250x350"
    },
    {
      uuid: "3",
      title: "The Two Towers",
      isbn: "9780547928203",
      author: "J.R.R. Tolkien",
      price: "9.99",
      cover: "https://via.placeholder.com/250x350"
    },
    {
      uuid: "4",
      title: "The Return of the King, and yet another long title to make sure it wraps properly and looks good on the page",
      isbn: "9780547928197",
      author: "J.R.R. Tolkien",
      price: "9.99",
      cover: "https://via.placeholder.com/250x350"
    }
  ];

  onSearchButtonPressed(string: String): void {
    this.router.navigate(['/books'], { queryParams: { search: string } });
  }
}