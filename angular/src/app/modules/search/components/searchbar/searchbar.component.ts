import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { FilterDialogComponent } from '../filter-dialog/filter-dialog.component';

import { searchFilters } from '../../../../common/classes/searchFilters';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.scss']
})
export class SearchbarComponent{
  @Input() inputData: string = "";
  @Output() search = new EventEmitter<string>();
  @ViewChild('searchInput') searchInput!: ElementRef;

  ISBN: string = "";
  MIN: string = "";
  MAX: string = "";
  AUTHOR: string = "";
  
  constructor(private dialog: MatDialog) { }

  onSearchButtonPressed(): void {
    if(this.searchInput.nativeElement.value === "") {
      return;      
    }
    this.search.emit(this.searchInput.nativeElement.value);
  }

  calculateFilters(): void {
    const isbnRegex = /ISBN::(?<isbn>\d*);?/;
    const minRegex = /MIN::(?<min>\d*);?/;
    const maxRegex = /MAX::(?<max>\d*);?/;
    const authorRegex = /AUTHOR::(?<author>[^;]*);?/;

    const isbnMatch = this.searchInput.nativeElement.value.match(isbnRegex);
    const minMatch = this.searchInput.nativeElement.value.match(minRegex);
    const maxMatch = this.searchInput.nativeElement.value.match(maxRegex);
    const authorMatch = this.searchInput.nativeElement.value.match(authorRegex);

    this.ISBN = isbnMatch ? isbnMatch.groups?.isbn : "";
    this.MIN = minMatch ? minMatch.groups?.min : "";
    this.MAX = maxMatch ? maxMatch.groups?.max : "";
    this.AUTHOR = authorMatch ? authorMatch.groups?.author : "";
  }

  putDataInSearchBar(data: any): void {
    if(data.isbn) {
      this.searchInput.nativeElement.value = this.searchInput.nativeElement.value.replace(/ISBN::\d*;?/, "");
      this.searchInput.nativeElement.value = `ISBN::${data.isbn};`;
    }
    else{
      this.searchInput.nativeElement.value = this.searchInput.nativeElement.value.replace(/ISBN::\d*;?/, "");
    }
    if(data.min) {
      this.searchInput.nativeElement.value = this.searchInput.nativeElement.value.replace(/MIN::\d*;?/, "");
      this.searchInput.nativeElement.value += `MIN::${data.min};`;
    }
    else{
      this.searchInput.nativeElement.value = this.searchInput.nativeElement.value.replace(/MIN::\d*;?/, "");
    }
    if(data.max) {
      this.searchInput.nativeElement.value = this.searchInput.nativeElement.value.replace(/MAX::\d*;?/, "");
      this.searchInput.nativeElement.value += `MAX::${data.max};`;
    }
    else{
      this.searchInput.nativeElement.value = this.searchInput.nativeElement.value.replace(/MAX::\d*;?/, "");
    }
    if(data.author) {
      this.searchInput.nativeElement.value = this.searchInput.nativeElement.value.replace(/AUTHOR::[^;]*;?/, "");
      this.searchInput.nativeElement.value += `AUTHOR::${data.author};`;
    }
    else{
      this.searchInput.nativeElement.value = this.searchInput.nativeElement.value.replace(/AUTHOR::[^;]*;?/, "");
    }
  }

  onSearchFilterPressed(event: MouseEvent): void {
    this.calculateFilters();

    let data: searchFilters = {
      isbn: this.ISBN,
      min: this.MIN,
      max: this.MAX,
      author: this.AUTHOR
    };

    const dialogConfig = {
      position: {
        left: `${event.clientX}px`,
        top: `${event.clientY}px`
      },
      data: data
    };
  
    this.dialog.open(FilterDialogComponent, dialogConfig,
      ).afterClosed().subscribe(result => {
        if(result) {
          this.putDataInSearchBar(result);
        }
      });
  }
}