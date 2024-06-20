import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-book-card-offers',
  templateUrl: './book-card-offers.component.html',
  styleUrls: ['./book-card-offers.component.scss']
})
export class BookCardOffersComponent {
  @Input() offer: any;

  constructor() { }

  ngOnInit() {
    console.log(this.offer);
  }
}
