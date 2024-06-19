import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BookFilterComponent } from '../book-filter/book-filter.component';
import { modSearchFilters } from 'src/app/common/classes/modSearchFilters';

@Component({
  selector: 'app-book-search',
  templateUrl: './book-search.component.html',
  styleUrls: ['./book-search.component.scss']
})
export class BookSearchComponent {

  @Input() inputData: string = "";
  @Output() search = new EventEmitter<string>();
  @ViewChild('searchInput') searchInput!: ElementRef;

  ISBN: string = "";
  OWNER: string = "";
  TITLE: string = "";

  constructor(private dialog: MatDialog) { }

  onSearchButtonPressed(): void {
    this.search.emit(this.searchInput.nativeElement.value);
  }

  calculateFilters(): void {
    const isbnRegex = /ISBN::(?<isbn>\d*);?/;
    const ownerRegex = /OWNER::(?<owner>[^;]*);?/;
    const titleRegex = /TITLE::(?<title>[^;]*);?/;

    const isbnMatch = this.searchInput.nativeElement.value.match(isbnRegex);
    const ownerMatch = this.searchInput.nativeElement.value.match(ownerRegex);
    const titleMatch = this.searchInput.nativeElement.value.match(titleRegex);

    this.ISBN = isbnMatch ? isbnMatch.groups?.isbn : "";
    this.OWNER = ownerMatch ? ownerMatch.groups?.owner : "";
    this.TITLE = titleMatch ? titleMatch.groups?.title : "";
  }

  putDataInSearchBar(data: any): void {
    if(data.isbn) {
      this.searchInput.nativeElement.value = this.searchInput.nativeElement.value.replace(/ISBN::\d*;?/, "");
      this.searchInput.nativeElement.value = `ISBN::${data.isbn};`;
    }
    else{
      this.searchInput.nativeElement.value = this.searchInput.nativeElement.value.replace(/ISBN::\d*;?/, "");
    }
    if(data.owner) {
      this.searchInput.nativeElement.value = this.searchInput.nativeElement.value.replace(/OWNER::[^;]*;?/, "");
      this.searchInput.nativeElement.value += `OWNER::${data.owner};`;
    }
    else{
      this.searchInput.nativeElement.value = this.searchInput.nativeElement.value.replace(/OWNER::[^;]*;?/, "");
    }
    if(data.title) {
      this.searchInput.nativeElement.value = this.searchInput.nativeElement.value.replace(/TITLE::[^;]*;?/, "");
      this.searchInput.nativeElement.value += `TITLE::${data.title};`;
    }
    else{
      this.searchInput.nativeElement.value = this.searchInput.nativeElement.value.replace(/TITLE::[^;]*;?/, "");
    }
  }

  onSearchFilterPressed(event: MouseEvent): void {
    this.calculateFilters();

    let data = {
      isbn: this.ISBN,
      owner: this.OWNER,
      title: this.TITLE
    };

    const dialogConfig = {
      position: {
        left: `${event.clientX}px`,
        top: `${event.clientY}px`
    },
    data: data
    };

    this.dialog.open(BookFilterComponent, dialogConfig
    ).afterClosed().subscribe((data: modSearchFilters) => {
      if(data) {
        this.putDataInSearchBar(data);
      }
    });
  }
}
