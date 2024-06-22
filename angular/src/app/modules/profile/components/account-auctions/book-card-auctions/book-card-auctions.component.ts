import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-book-card-auctions',
  templateUrl: './book-card-auctions.component.html',
  styleUrls: ['./book-card-auctions.component.scss']
})
export class BookCardAuctionsComponent {
  @Input() purchase: any;
  @Output() statusChanged = new EventEmitter<
  {
    id: string;
    status: string;
  }
  >();

  status = '';

  constructor(
    private router: Router
  ) { }

  mapStatus: { [key: string]: string } = {
    'reserve_price_not_met': 'Reserve price not met',
    'sold': 'Sold',
    'shipped': 'Shipped',
    'received': 'Received',
  };

  convertStatus(status: string) {
    return this.mapStatus[status];
  }

  changeStatus() {
    this.statusChanged.emit({
      id: this.purchase._id,
      status: this.status
    });
  }

  goToBook() {
    this.router.navigate([`/books/${this.purchase.auction}`]);
  }
}