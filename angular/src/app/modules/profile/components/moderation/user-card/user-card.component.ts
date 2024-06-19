import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss']
})
export class UserCardComponent {
  @Input() user: any;
  @Output() ban = new EventEmitter<string>();


  banUser(id: string){
    this.ban.emit(id);
  }
}
