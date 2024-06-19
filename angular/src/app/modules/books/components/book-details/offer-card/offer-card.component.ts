import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-offer-card',
  templateUrl: './offer-card.component.html',
  styleUrls: ['./offer-card.component.scss']
})
export class OfferCardComponent {
  @Input() offer: any;
  @Output() onBid = new EventEmitter<number>();

  priceForm = new FormGroup({
    price: new FormControl(
      '',
      Validators.compose([
        Validators.required,
        Validators.min(1),
        Validators.pattern('^[0-9]*$')
      ])
    )
  });


  onSubmit() {
    if(this.priceForm.valid) {
      const price = parseInt(this.priceForm.value.price!);
      this.onBid.emit(price);
    }
  }
  
}