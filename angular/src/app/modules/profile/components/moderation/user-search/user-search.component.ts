import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-user-search',
  templateUrl: './user-search.component.html',
  styleUrls: ['./user-search.component.scss']
})
export class UserSearchComponent {
  @Input() inputData: string = "";
  @Output() search = new EventEmitter<string>();
  @ViewChild('searchInput') searchInput!: ElementRef;
  
  onSearchButtonPressed(): void {
    if(this.searchInput.nativeElement.value === "") {
      return;      
    }
    this.search.emit(this.searchInput.nativeElement.value);
  }
}
