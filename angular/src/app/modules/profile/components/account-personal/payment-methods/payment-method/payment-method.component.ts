import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PaymentMethod } from 'src/app/common/models/payment-method/paymentMethod';

@Component({
  selector: 'app-payment-method',
  templateUrl: './payment-method.component.html',
  styleUrls: ['./payment-method.component.scss']
})
export class PaymentMethodComponent {
  @Output() delete = new EventEmitter<number>();
  @Output() edit = new EventEmitter();
  @Input() paymentMethod: PaymentMethod | undefined | null;

  deletePaymentMethod() {
    this.delete.emit(this.paymentMethod?.id);
  }

  editPaymentMethod() {
    this.edit.emit(this.paymentMethod);
  }

  deleteFunc() {
    console.log('Delete')
    alert('Delete not implemented')
  }

  editFunc() {
    console.log('Edit')
    alert('Edit not implemented')
  }

}
