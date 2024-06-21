import { Component, Input } from '@angular/core';
import { Message } from 'src/app/common/models/message';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent {
  @Input() message: Message | null = null;
  @Input() isMe = false;
  @Input() isOwner = false;

  constructor() { }
}
