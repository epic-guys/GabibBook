import { Component, HostListener, Inject, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { modSearchFilters } from 'src/app/common/classes/modSearchFilters';

@Component({
  selector: 'app-book-filter',
  templateUrl: './book-filter.component.html',
  styleUrls: ['./book-filter.component.scss'],
})
export class BookFilterComponent {
  constructor(
    public dialogRef: MatDialogRef<BookFilterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: modSearchFilters,
  ) {}

  onFilterChanged(event: any, key: string): void {
    this.data[key as keyof modSearchFilters] = event.target.value;
  }


  @HostListener('window:keyup.Enter', ['$event'])
  onDialogClick(event: KeyboardEvent): void {
    this.dialogRef.close(this.data);
  }
}
