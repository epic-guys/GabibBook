import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PaymentMethod } from 'src/app/common/models/payment-method/paymentMethod';

@Component({
  selector: 'app-payment-methods',
  templateUrl: './payment-methods.component.html',
  styleUrls: ['./payment-methods.component.scss']
})
export class PaymentMethodsComponent {
  @Input() paymentMethods: PaymentMethod[] = [];
  @Output() delete = new EventEmitter<number>();
  @Output() edit = new EventEmitter<PaymentMethod>();
  @Output() add = new EventEmitter<PaymentMethod>();
}
