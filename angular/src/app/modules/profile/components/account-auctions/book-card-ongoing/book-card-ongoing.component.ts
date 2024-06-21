import { Component, Input } from '@angular/core';

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

  constructor() { }

  ngOnInit(): void {
    this.title = this.auction.title;
    this.isbn = this.auction.isbn;
    if(this.auction.offers.length > 0){
      this.price = this.auction.offers[0].value;
    }else{
      this.price = this.auction.start_price;
    }
  }
}
