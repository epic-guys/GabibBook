import { Component, EventEmitter, HostListener, Inject, Input, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-notification-dialog',
  templateUrl: './notification-dialog.component.html',
  styleUrls: ['./notification-dialog.component.scss']
})
export class NotificationDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  pop($event: any) {
    this.data = this.data.filter((notification: any) => notification._id !== $event);
  }


  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (  !(event.target instanceof HTMLElement && event.target.classList.contains('mat-mdc-button-touch-target')) &&
          !(event.target instanceof HTMLElement && event.target.classList.contains('mat-icons'))
    ) 
    { 
      this.dialogRef.close(this.data);
    }

  }
}