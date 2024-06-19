import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-book-card-mod',
  templateUrl: './book-card.component.html',
  styleUrls: ['./book-card.component.scss']
})
export class BookCardComponent {
  @Input() book: any
  @Output() remove = new EventEmitter<string>();

  constructor(private router: Router) { }

  banBook(id: string){
    this.remove.emit(id)
  }

  gotoBook(id: string){
    this.router.navigate([`/books/${id}`])
  }
}
