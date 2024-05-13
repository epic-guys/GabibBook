import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent {
  @Input() currentPage: number = 1;
  @Input() totalPages: number = 1;
  @Output() pageChanged: EventEmitter<number> = new EventEmitter<number>();
  
  constructor() { }

  onPreviousPage(): void {
    if (this.currentPage > 1) {
      this.pageChanged.emit(this.currentPage - 1);
    }
  }

  onNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.pageChanged.emit(this.currentPage + 1);
    }
  }

  onPageClicked(page: number): void {
    this.pageChanged.emit(page);
  }
  
  getPages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  isCurrentPage(page: number): boolean {
    return page === this.currentPage;
  }

  isFirstPage(): boolean {
    return this.currentPage === 1;
  }

  isLastPage(): boolean {
    return this.currentPage === this.totalPages;
  }
}
