import { Component, Input } from '@angular/core';

import { Book } from '../../classes/book';

@Component({
  selector: 'app-book-card',
  templateUrl: './book-card.component.html',
  styleUrls: ['./book-card.component.scss']
})
export class BookCardComponent {
  @Input() book!: Book;

  constructor() { }

  getCover(): string {
    return `url(${this.book.cover})`;
  }
}
