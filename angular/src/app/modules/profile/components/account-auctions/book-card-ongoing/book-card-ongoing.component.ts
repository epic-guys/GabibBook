import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-book-card-ongoing',
  templateUrl: './book-card-ongoing.component.html',
  styleUrls: ['./book-card-ongoing.component.scss']
})
export class BookCardOngoingComponent {
  @Input() auction: any;
  title: string = '';
  isbn: string = '';
  price: number = 0;

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
    this.title = this.auction.title;
    this.isbn = this.auction.isbn;
    if(this.auction.offers.length > 0){
      this.price = this.auction.offers[0].value;
    }else{
      this.price = this.auction.start_price;
    }
  }

  goToBook() {
    this.router.navigate([`/books/${this.auction._id}`]);
  }
}
