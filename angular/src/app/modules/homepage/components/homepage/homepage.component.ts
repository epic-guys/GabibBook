import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Book } from '../../../../common/models/book';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent {

  ajaxLoading = false;

  constructor(private router: Router) { }

  books: Book[] = [];

  ngOnInit() {
    this.ajaxLoading = true;
    
  }

  onSearchButtonPressed(string: String): void {
    this.router.navigate(['/books'], { queryParams: { search: string } });
  }
}