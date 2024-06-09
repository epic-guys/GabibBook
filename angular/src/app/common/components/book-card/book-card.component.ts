import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { Book } from '../../models/book';

@Component({
  selector: 'app-book-card',
  templateUrl: './book-card.component.html',
  styleUrls: ['./book-card.component.scss']
})
export class BookCardComponent {
  @Input() book!: Book;

  constructor(private router: Router) { }

  getCover(): string {
    return `url(${this.book.cover})`;
  }

  goToBookDetails(): void {
    console.log(`Navigating to book details for book with ID: ${this.book['uuid']}`);
    this.router.navigate([`/books/${this.book['uuid']}`]);    
  }
}
