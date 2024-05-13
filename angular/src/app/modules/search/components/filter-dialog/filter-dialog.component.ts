import { Component, Inject, HostListener } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { searchFilters } from '../../../../common/classes/searchFilters';

@Component({
  selector: 'app-filter-dialog',
  templateUrl: './filter-dialog.component.html',
  styleUrls: ['./filter-dialog.component.scss']
})
export class FilterDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<FilterDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: searchFilters,
  ) {}

  onFilterChanged(event: any, key: string): void {
    this.data[key as keyof searchFilters] = event.target.value;
  }


  @HostListener('window:keyup.Enter', ['$event'])
  onDialogClick(event: KeyboardEvent): void {
    this.dialogRef.close(this.data);
  }
}
